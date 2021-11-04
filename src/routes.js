const express = require('express');
const users = require('./controllers/users');
const products = require('./controllers/products');
const loginVerification = require('./middlewares/loginVerification');

const routes = express();

//usuarios
routes.post('/usuarios', users.cadastrarUsuario);
routes.post('/login', users.login);

//rotas com autenticação necessária
routes.use(loginVerification);

routes.get('/usuarios', users.detalharUsuario);
routes.put('/usuarios', users.atualizarUsuario);

//produtos
routes.post('/produtos', products.cadastrarProduto);
routes.get('/produtos', products.listarProdutos);
routes.get('/produtos/:id', products.detalharProduto);
routes.put('/produtos/:id', products.atualizarProduto);
routes.delete('/produtos/:id', products.excluirProduto);

module.exports = routes;
