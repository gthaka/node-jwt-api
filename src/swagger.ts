import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JWT Server API Documentation',
            version: '1.0.0',
            description: 'API documentation for Node JWT Server',
        },
        basePath: '/api',
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsDoc(options);

export default (app: express.Application): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
