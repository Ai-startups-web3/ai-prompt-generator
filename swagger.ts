import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from './config';

const PORT =config.port

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation For C3I',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Developer',
      },
      servers: [
        { url: `http://localhost:${PORT}` }
      ],
      
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, specifies the format
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Applies globally to all endpoints
      },
    ],
    servers: [
      {
        url: "/backend/v1", // This will automatically prefix /v1 to all paths
      },
      {
        url: "/backend/v2", // This will automatically prefix /v2 to all paths
      },
    ],
  },
  apis: ['./backend/routes/**/*.ts', './backend/routes/*.ts'],


};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
  app.use('/api-docs', (req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  }, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  
};