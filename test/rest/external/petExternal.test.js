const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();
const utilsFuncoes = require('../utils/funcoes');

describe('Pets external', () => {
    let token;

    before(async () => {
        token = await utilsFuncoes.obterToken();
    });

    context('POST /pets', () => {
        it('Deve cadastrar um pet', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsSuccessfully.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .set('Authorization', `Bearer ${token}`)
                .send(postPetBody);

            const postPetResponse = require('../fixtures/respostas/pets/postPetsSuccessfully.json');
            expect(resposta.status).to.equal(201);
            expect(resposta.body).excluding('id').to.deep.equal(postPetResponse);

            const idDoPet = resposta.body.id;
            const respostaExclusao = await utilsFuncoes.excluirPet(idDoPet, token);
            expect(respostaExclusao.status).to.equal(204);
        });

        it('Não deve cadastrar um pet caso não tenha sido preenchido o nome', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsWithoutName.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .set('Authorization', `Bearer ${token}`)
                .send(postPetBody);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Name and type required');
        });

        it('Não deve cadastrar um pet caso não tenha sido preenchido o tipo', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsWithoutType.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .set('Authorization', `Bearer ${token}`)
                .send(postPetBody);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Name and type required');
        });

        it('Não deve cadastrar um pet caso o nome seja igual ao de outro pet já existente do mesmo usuário', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsNameEqual.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .set('Authorization', `Bearer ${token}`)
                .send(postPetBody);

            expect(resposta.status).to.equal(409);
            expect(resposta.body.error).to.equal('Pet with this name already exists for this user');
        });

        it('Não deve cadastrar um pet sem estar autenticado', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsSuccessfully.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .send(postPetBody);

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Token required');
        });
    });

    context('GET /pets', () => {
        it('Deve buscar todos os pets cadastrados para todos os usuários', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/pets')
                .set('Authorization', `Bearer ${token}`);

            const getPetResponse = require('../fixtures/respostas/pets/getAllPetsSuccessfully.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.include.members(getPetResponse);
        });

        it('Não deve buscar pets sem estar autenticado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/pets');

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Token required');
        });
    });

    context('GET /mypets', () => {
        it('Deve buscar todos os pets do usuário autenticado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/mypets')
                .set('Authorization', `Bearer ${token}`);

            const getMyPetsResponse = require('../fixtures/respostas/pets/getMyPetsSuccessfully.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.include.members(getMyPetsResponse);
        });

        it('Deve filtrar pets do usuário autenticado por nome', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/mypets')
                .query({ name: 'Luke' })
                .set('Authorization', `Bearer ${token}`);

            const getMyPetsResponse = require('../fixtures/respostas/pets/getMyPetsFilterName.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(getMyPetsResponse);
        });

        it('Deve filtrar pets do usuário autenticado por tipo', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/mypets')
                .query({ type: 'Jabuti' })
                .set('Authorization', `Bearer ${token}`);

            const getMyPetsResponse = require('../fixtures/respostas/pets/getMyPetsFilterType.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(getMyPetsResponse);
        });

        it('Não deve buscar pets do usuário sem estar autenticado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/mypets');

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Token required');
        });
    });

    context('DELETE /pets/:id', () => {
        it('Deve excluir um pet do usuário autenticado', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsSuccessfully.json');
            const respostaCadastro = await utilsFuncoes.cadastrarPet(postPetBody, token);
            const idDoPet = respostaCadastro.body.id;

            const resposta = await request(process.env.BASE_URL_REST)
                .delete(`/pets/${idDoPet}`)
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(204);
        });

        it('Não deve excluir um pet inexistente ou de outro usuário', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .delete('/pets/3')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(404);
            expect(resposta.body.error).to.equal('Pet not found or not owned by user');
        });

        it('Não deve excluir um pet com id inválido', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .delete('/pets/abc')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(400);
            expect(resposta.body.error).to.equal('Pet id required');
        });

        it('Não deve excluir um pet sem estar autenticado', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .delete('/pets/1');

            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Token required');
        });
    });
});
