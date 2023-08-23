import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import apiPaths from './apiPaths';

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JWT Server API Documentation',
            version: '1.0.0',
            description: 'API documentation for Node JWT Server',
        },
        // basePath: '/api',
        servers: [
            {
                url: '/api',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        paths: apiPaths,
    },
    apis: ['./src/routes/authRoutes.ts', './src/routes/userRoutes.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

export default (app: express.Application): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
