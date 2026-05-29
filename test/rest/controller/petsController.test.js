const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

//let app = require('../../../rest/app');
const petService = require('../../../src/service/petService');
const authMiddleware = require('../../../rest/auth');
const utilsFuncoes = require('../utils/funcoes');

authMiddlewareMock = sinon.stub(authMiddleware, 'authenticateToken');
authMiddlewareMock.callsFake(utilsFuncoes.callsFakeAuthenticateToken);
const app = require('../../../rest/app');

describe('Pets Controller', () => {
    afterEach(() => {
        sinon.restore();
    })
    context('addPet', () => {
        beforeEach(() => {
            petServiceMock = sinon.stub(petService, 'addPet');
        })
        it('Quando informo um nome e um tipo válidos, retorno o status 201 e os dados do pet', async () => {
            const objetoSucesso = require('../fixtures/respostas/pets/postPetsSuccessfullyMock.json');
            petServiceMock.returns(objetoSucesso)
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsSuccessfully.json');
            const resposta = await request(app)
                .post('/pets')
                .send(postPetBody);
            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.deep.equal(objetoSucesso);
        });

        it('Quando não informo um nome, retorno o status 400 e a mensagem do erro', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsWithoutName.json');
            const resposta = await request(app)
                .post('/pets')
                .send(postPetBody);
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Name and type required');
        });

        it('Quando não informo um tipo, retorno o status 400 e a mensagem do erro', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsWithoutType.json');
            const resposta = await request(app)
                .post('/pets')
                .send(postPetBody);
            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Name and type required');
        });
        it('Quando preencho um nome já utilizado, retorno o status 409 e a mensagem do erro', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsNameEqual.json');
            petServiceMock.returns(null);
            const resposta = await request(app)
                .post('/pets')
                .send(postPetBody);
            expect(resposta.status).to.equal(409);
            expect(resposta.body.error).to.equal('Pet with this name already exists for this user');
        });
    });
    context('getPets', () => {
        beforeEach(() => {
            petServiceMock = sinon.stub(petService, 'getAllPets');
        })
        it('Ao obter todos os pets, retorno para o usuário o objeto devolvido pela service', async () => {
            const objetoRetornadoPelaService = require('../fixtures/respostas/pets/getAllPetsSuccessfully.json');
            petServiceMock.returns(objetoRetornadoPelaService);
            const resposta = await request(app)
                .get('/pets')
            expect(resposta.body).to.deep.equal(objetoRetornadoPelaService);
        });
    })
});
