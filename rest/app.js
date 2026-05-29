const express = require('express');
const userController = require('./controller/userController');
const petController = require('./controller/petController');
const statusController = require('./controller/statusController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const { authenticateToken } = require('./auth');

const app = express();
app.use(express.json());

// Rotas públicas
app.get('/status', statusController.getStatus);
app.post('/register', userController.register);
app.post('/login', userController.login);

// Rotas protegidas
app.get('/users', authenticateToken, userController.getUsers);
app.post('/pets', authenticateToken, petController.addPet);
app.get('/pets', authenticateToken, petController.getPets);

app.get('/mypets', authenticateToken, petController.getUserPets);
app.delete('/pets/:id', authenticateToken, petController.deletePet);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
