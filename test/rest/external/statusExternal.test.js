const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Status external', () => {
    context('GET /status', () => {
        it('Deve retornar o status operacional da API', async () => {
            const resposta = await request(process.env.BASE_URL_REST)
                .get('/status');

            const getStatusResponse = require('../fixtures/respostas/status/getStatusSuccessfully.json');
            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.deep.equal(getStatusResponse);
        });
    });
});
