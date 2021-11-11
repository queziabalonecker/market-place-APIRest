const express = require('express');
const users = require('./controllers/users');
const products = require('./controllers/products');
const loginVerification = require('./middlewares/loginVerification');

const routes = express();

routes.post('/usuarios', users.cadastrarUsuario);
routes.post('/login', users.login);

routes.use(loginVerification);

routes.get('/usuarios', users.detalharUsuario);
routes.put('/usuarios', users.atualizarUsuario);

routes.post('/produtos', products.cadastrarProduto);
routes.get('/produtos', products.listarProdutos);
routes.get('/produtos/:id', products.detalharProduto);
routes.put('/produtos/:id', products.atualizarProduto);
routes.delete('/produtos/:id', products.excluirProduto);

module.exports = routes;
