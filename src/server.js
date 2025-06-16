import express from 'express'
import { setupSwagger } from './docs/swagger.js'
import uploadRouter from './routes/uploadRouter.js'

const app = express()

// registra Swagger
setupSwagger(app)

app.use(express.json())
app.use(uploadRouter);

const port = 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})
