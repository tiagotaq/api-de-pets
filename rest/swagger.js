module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Cadastro de Pets API',
    version: '1.0.0',
    description: 'API para cadastro de usuários e pets, com autenticação JWT.'
  },
  servers: [
    { url: 'http://localhost:3000' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/status': {
      get: {
        tags: ['Status'],
        summary: 'Consulta o status da API',
        security: [],
        responses: {
          200: {
            description: 'Status operacional da API',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'Operacional' },
                    version: { type: 'string', example: '1.0.0' },
                    database: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'Operacional' },
                        maxConnections: { type: 'integer', example: 900 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/register': {
      post: {
        tags: ['Usuários'],
        summary: 'Registrar novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['username', 'password']
              }
            }
          }
        },
        responses: {
          201: { description: 'Usuário criado' },
          409: { description: 'Usuário já existe' },
          400: { description: 'Dados inválidos' }
        }
      }
    },
    '/login': {
      post: {
        tags: ['Usuários'],
        summary: 'Login do usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['username', 'password']
              }
            }
          }
        },
        responses: {
          200: { description: 'Login bem-sucedido, retorna JWT' },
          401: { description: 'Credenciais inválidas' },
          400: { description: 'Dados inválidos' }
        }
      }
    },
    '/users': {
      get: {
        tags: ['Usuários'],
        summary: 'Consulta de usuários',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de usuários' },
          401: { description: 'Token ausente ou inválido' }
        }
      }
    },
    '/pets': {
      post: {
        tags: ['Pets'],
        summary: 'Cadastrar pet para usuário',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' }
                },
                required: ['name', 'type']
              }
            }
          }
        },
        responses: {
          201: { description: 'Pet cadastrado' },
          409: { description: 'Pet já existe para o usuário' },
          400: { description: 'Dados inválidos' },
          401: { description: 'Token ausente ou inválido' }
        }
      },
      get: {
        tags: ['Pets'],
        summary: 'Consulta de todos os pets',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de pets' },
          401: { description: 'Token ausente ou inválido' }
        }
      },
    },
    '/pets/{id}': {
      delete: {
        tags: ['Pets'],
        summary: 'Exclui um pet do usuário logado',
        description: 'Exclui o pet pelo id, apenas se pertencer ao usuário autenticado.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID do pet a ser excluído'
          }
        ],
        responses: {
          204: { description: 'Pet excluído com sucesso' },
          400: { description: 'ID inválido' },
          404: { description: 'Pet não encontrado ou não pertence ao usuário' },
          401: { description: 'Token ausente ou inválido' }
        }
      }
    },
    '/mypets': {
      get: {
        tags: ['Pets'],
        summary: 'Consulta de pets do usuário logado',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'name',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filtra os pets pelo nome'
          },
          {
            name: 'type',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Filtra os pets pelo tipo'
          }
        ],
        responses: {
          200: { description: 'Lista de pets do usuário' },
          401: { description: 'Token ausente ou inválido' }
        }
      }
    }
  }
};
