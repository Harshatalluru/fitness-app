import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Platform API',
      version: '1.0.0',
      description: 'REST API for managing gyms and users at a fitness platform'
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
       { url: 'https://fitness-app-latest-ld2y.onrender.com', description: 'production server' }
      
    ]
  },
  apis: ['./src/interfaces/routes/*.ts']
};

export const specs = swaggerJsdoc(options);