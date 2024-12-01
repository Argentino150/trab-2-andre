const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db'); // Importa a conexão com o banco
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const routes = require('./routes'); // Importa as rotas centralizadas

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

// Conectar ao MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Registro de todas as rotas centralizadas
app.use('/api', routes);

// Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Ensino Especial',
      version: '1.0.0',
      description: 'API com documentação Swagger.',
    },
    servers: [{ url: 'http://localhost:3000/api/' }],
  },
  apis: ['./src/routes/*.js'], // Caminho dos arquivos para documentar no Swagger
};
const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
