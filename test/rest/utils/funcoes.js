const request = require('supertest');
require('dotenv').config();

async function cadastrarPet(body, token) {
    return await request(process.env.BASE_URL_REST)
        .post('/pets')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
}

async function excluirPet(idDoPet, token) {
    return await request(process.env.BASE_URL_REST)
        .delete(`/pets/${idDoPet}`)
        .set('Authorization', `Bearer ${token}`);
}

async function obterToken() {
    const postLogin = require('../fixtures/requisicoes/login/postLogin.json');
    const respostaLogin = await request(process.env.BASE_URL_REST)
        .post('/login')
        .send(postLogin);
    return respostaLogin.body.token;
}

let callsFakeAuthenticateToken = (req, res, next) => {
    const user = { id: 1, username: 'tiago' }
    req.user = user;
    next();
}

module.exports = {
  cadastrarPet,
  excluirPet,
  obterToken,
  callsFakeAuthenticateToken
};