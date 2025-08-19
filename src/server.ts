import express from 'express'
import { setupSwagger } from './docs/swagger';
import router from './routes/upload.route';

const app = express()

setupSwagger(app)

app.use(express.json())
app.use(router);

const port = 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})