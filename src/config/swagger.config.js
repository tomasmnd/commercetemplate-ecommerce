import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FakeLibre',
      version: '0.1.0',
      description: 'Ecommerce for Coderhouse Backend course.',
    },
  },
  apis: ['../docs/models/*.yaml',
    '../docs/controllers/*.yaml',
    '../docs/routes/*.yaml',
    '../docs/dao/*.yaml',
    '../docs/utils/*.yaml',
    '../docs/repositories/*.yaml',
    '../docs/dto/*.yaml'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;
