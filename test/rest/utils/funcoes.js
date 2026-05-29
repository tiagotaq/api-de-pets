const request = require('supertest');
require('dotenv').config();

async function excluirPet(idDoPet, token) {
    return await request(process.env.BASE_URL_REST)
        .delete(`/pets/${idDoPet}`)
        .set('Authorization', `Bearer ${token}`);
}

let callsFakeAuthenticateToken = (req, res, next) => {
    const user = { id: 1, username: 'tiago' }
    req.user = user;
    next();
}

module.exports = {
  excluirPet,
  callsFakeAuthenticateToken
};