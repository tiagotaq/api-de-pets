# Cadastro de Pets API

API REST simples para cadastro de usuários e pets, criada para estudos de testes e automação em nível de API.

O projeto usa Express, autenticação JWT, documentação Swagger e armazenamento em memória. Ao reiniciar a aplicação, os registros criados são perdidos.

## Tecnologias

- Node.js
- Express
- JWT
- Swagger UI
- Mocha, Chai, Sinon e Supertest

## Estrutura

```text
src/
  model/      Modelos e armazenamento em memória
  service/    Regras de negócio da aplicação

rest/
  app.js
  server.js
  auth.js
  swagger.js
  controller/

test/
  rest/
```

## Instalação

```powershell
npm install
```

## Como Rodar

```powershell
npm start
```

Também é possível usar o script específico da API REST:

```powershell
npm run start-rest
```

A API roda por padrão em:

```text
http://localhost:3000
```

A documentação Swagger fica disponível em:

```text
http://localhost:3000/api-docs
```

## Autenticação

As rotas públicas não exigem token:

- `POST /register`
- `POST /login`
- `GET /status`

As demais rotas exigem o header:

```text
Authorization: Bearer <token>
```

## Endpoints

### Status

```http
GET /status
```

Retorna o status da API e não exige autenticação.

Exemplo de resposta:

```json
{
  "status": "Operacional",
  "version": "1.0.0",
  "database": {
    "status": "Operacional",
    "maxConnections": 900
  }
}
```

### Usuários

```http
POST /register
POST /login
GET /users
```

### Pets

```http
POST /pets
GET /pets
GET /mypets
DELETE /pets/:id
```

O endpoint `GET /mypets` permite filtros opcionais por query string:

```http
GET /mypets?name=Rex
GET /mypets?type=Cachorro
GET /mypets?name=Rex&type=Cachorro
```

## Testes

O projeto possui testes de controller e testes externos para a API REST.

Para testes externos, crie um arquivo `.env` na raiz do projeto:

```env
BASE_URL_REST=http://localhost:3000
```

Comandos disponíveis:

```powershell
npm run test-rest-controller
npm run test-rest-external
```

Antes de executar os testes externos, suba a API REST.

## Observações

- O banco em memória deixa a aplicação leve e previsível para estudos.
- Como os dados são reiniciados a cada execução, os cenários de teste podem criar massa sem depender de um banco real.
- A camada `src/service` concentra as regras de negócio usadas pelos controllers REST.
