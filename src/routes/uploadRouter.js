import express from 'express';
import upload from '../config/multerConfig.js';
import supabase from '../config/supabaseClient.js';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Faz upload de uma imagem
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 url:
 *                   type: string
 *       400:
 *         description: Nenhum arquivo enviado
 *       500:
 *         description: Erro no servidor
 */
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) return res.status(400).json({error: 'No file uploaded'});

        const fileName = uuidv4();

        const {error} = await supabase.storage.from('microservicoimagens').upload(fileName, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '7200',
            upsert: false
        });

        if (error) {
            return res.status(500).json({error: error.message});
        }

        const {data} = supabase.storage.from('microservicoimagens').getPublicUrl(fileName);

        res.json({message: 'Upload successful', url: data.publicUrl});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});


export default router;
