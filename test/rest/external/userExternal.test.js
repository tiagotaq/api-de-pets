const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const utilsFuncoes = require('../utils/funcoes');

describe('Users external', () => {
    let token;

    before(async () => {
        token = await utilsFuncoes.obterToken();
    });

    context('POST /register', () => {
        it('Deve cadastrar um novo usuário', async () => {
            const username = `usuario_${Date.now()}`;
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/register')
                .send({ username, password: 'senha123' });

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('id');
            expect(resposta.body.username).to.equal(username);
        });

        it('Não deve cadastrar um usuário sem username', async () => {
            const postRegisterBody = require('../fixtures/requisicoes/users/postRegisterWithoutUsername.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/register')
                .send(postRegisterBody);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Username and password required');
        });

        it('Não deve cadastrar um usuário sem password', async () => {
            const postRegisterBody = require('../fixtures/requisicoes/users/postRegisterWithoutPassword.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/register')
                .send(postRegisterBody);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Username and password required');
        });

        it('Não deve cadastrar um usuário com username já existente', async () => {
            const postRegisterBody = require('../fixtures/requisicoes/users/postRegisterDuplicate.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/register')
                .send(postRegisterBody);

            expect(resposta.status).to.equal(409);
            expect(resposta.body.error).to.equal('User already exists');
        });
    });

    context('POST /login', () => {
        it('Deve autenticar um usuário com credenciais válidas', async () => {
            const postLoginBody = require('../fixtures/requisicoes/login/postLogin.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send(postLoginBody);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.have.property('token');
        });

        it('Não deve autenticar com credenciais inválidas', async () => {
            const postLoginBody = require('../fixtures/requisicoes/users/postLoginInvalidCredentials.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send(postLoginBody);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Invalid credentials');
        });

        it('Não deve autenticar sem username', async () => {
            const postLoginBody = require('../fixtures/requisicoes/users/postLoginWithoutUsername.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send(postLoginBody);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Username and password required');
        });

        it('Não deve autenticar sem password', async () => {
            const postLoginBody = require('../fixtures/requisicoes/users/postLoginWithoutPassword.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/login')
                .send(postLoginBody);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Username and password required');
        });
    });

    context('GET /users', () => {
        it('Deve listar todos os usuários cadastrados', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/users')
                .set('Authorization', `Bearer ${token}`);

            const getUsersResponse = require('../fixtures/respostas/users/getUsersSuccessfully.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.include.members(getUsersResponse);
        });

        it('Não deve listar usuários sem estar autenticado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/users');

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Token required');
        });
    });
});
