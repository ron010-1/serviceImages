import {Application} from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Micro Serviço de Imagens.',
            version: '1.0.0',
            description: 'Micro Serviço de Imagens com upload no supabase.'
        }
    },
    apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Application) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
