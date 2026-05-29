const request = require('supertest');
const { expect, use } = require('chai');
const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();
const utilsFuncoes = require('../utils/funcoes');

describe('Pets external', () => {
    before(async () => {
        const postLogin = require('../fixtures/requisicoes/login/postLogin.json');
        const respostaLogin = await request(process.env.BASE_URL_REST)
            .post('/login')
            .send(postLogin);

        token = respostaLogin.body.token;
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
            expect(resposta.body).excluding('id').to.deep.equal(postPetResponse)

            //Exclusão do cadastro realizado para repetibilidade desse teste (visto que existe uma regra na API de não poder haver mais um pet com o mesmo nome para o mesmo usuário) e para independência dos testes dos GETs de pets
            const idDoPet = resposta.body.id;
            utilsFuncoes.excluirPet(idDoPet, token).then(resposta => {
                expect(resposta.status).to.equal(204);
            })
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
            expect(resposta.body.error).to.equal('Name and type required')
        });

        it('Não deve cadastrar um pet caso não o nome seja igual ao de outro pet já existente do mesmo usuário', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsNameEqual.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .set('Authorization', `Bearer ${token}`)
                .send(postPetBody);
            
            expect(resposta.status).to.equal(409);
            expect(resposta.body.error).to.equal('Pet with this name already exists for this user')
        });
        it('Não deve cadastrar um pet sem estar autenticado', async () => {
            const postPetBody = require('../fixtures/requisicoes/pets/postPetsSuccessfully.json');
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/pets')
                .send(postPetBody);
            
            expect(resposta.status).to.equal(401);
            expect(resposta.body.error).to.equal('Token required')
        });
    });
    context('GET /pets', () => {
        it('Deve buscar todos os pets cadastrados para todos os usuários', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/pets')
                .set('Authorization', `Bearer ${token}`)
            
            const getPetResponse = require('../fixtures/respostas/pets/getAllPetsSuccessfully.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(getPetResponse)
        });
    });
});
