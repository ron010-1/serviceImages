import express, { Request, Response } from 'express';
import upload from '../config/multerConfig.js';
import { v4 as uuidv4 } from 'uuid';
import { ZodError } from 'zod';
import supabase from '../config/supabaseClient.js';

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
 *         description: Nenhum arquivo enviado ou tipo inválido
 *       500:
 *         description: Erro no servidor
 */
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ 
                error: 'Nenhum arquivo enviado',
                details: 'Envie uma imagem no campo "image"' 
            });
        }

        // Validação do tipo de arquivo
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({
                error: 'Tipo de arquivo não suportado',
                details: `Tipos permitidos: ${allowedMimeTypes.join(', ')}`
            });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return res.status(400).json({
                error: 'Arquivo muito grande',
                details: 'Tamanho máximo permitido: 5MB'
            });
        }

        const fileName = `${uuidv4()}-${file.originalname}`;
        const bucketName = 'microservicoimagens';

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Erro no upload:', uploadError);
            return res.status(500).json({ 
                error: 'Falha no upload',
                details: uploadError.message 
            });
        }

        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        if (!urlData) {
            return res.status(500).json({ 
                error: 'Falha ao gerar URL pública' 
            });
        }

        console.log(`Upload realizado: ${fileName} (${file.size} bytes)`);

        res.status(200).json({
            message: 'Upload realizado com sucesso',
            url: urlData.publicUrl,
            fileName: fileName,
            size: file.size,
            mimeType: file.mimetype
        });

    } catch (err) {
        console.error('Erro interno:', err);
        
        if (err instanceof ZodError) {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: err.errors
            });
        }

        const errorMessage = err instanceof Error ? err.message : 'Erro interno desconhecido';
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: errorMessage 
        });
    }
});

export default router;