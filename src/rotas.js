const express = require('express');
const usuarios = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');
const verificarLogin = require('./middlewares/verificarLogin');

const rotas = express();

//usuarios
rotas.post('/usuarios', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.login);

//rotas com autenticação necessária
rotas.use(verificarLogin);

rotas.get('/usuarios', usuarios.detalharUsuario);
rotas.put('/usuarios', usuarios.atualizarUsuario);

//produtos
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.detalharProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;
