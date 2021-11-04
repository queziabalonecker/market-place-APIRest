const connection = require('../db_connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const signUpSchema = require('../validations/validateUsers/signUpSchema');
const loginSchema = require('../validations/validateUsers/loginSchema');

async function cadastrarUsuario(req, res) {
  const { nome, email, senha, nome_loja } = req.body;

  try {
    await signUpSchema.validate(req.body);

    const queryEmail = 'select * from usuarios where email = $1';
    const { rowCount } = await connection.query(queryEmail, [email]);
    if (rowCount > 0) {
      return res.status(400).json({
        mensagem: 'Já existe usuário cadastrado com o e-mail informado.',
      });
    }
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);
  try {
    const queryCadastro =
      'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
    const { rowCount } = await connection.query(queryCadastro, [
      nome,
      nome_loja,
      email,
      senhaCriptografada,
    ]);
    if (rowCount === 0) {
      return res.status(400).json({
        mensagem: 'Não foi possível realizar o cadastro.',
      });
    }

    return res.status(200).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    return res.status(400).json({
      mensagem: 'Não foi possível realizar o cadastro.',
    });
  }
}

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    await loginSchema.validate(req.body);

    const queryEmail = 'select * from usuarios where email = $1';
    const { rows: usuarios, rowCount: quantidadeUsuarios } = await connection.query(queryEmail, [
      email,
    ]);

    if (quantidadeUsuarios === 0) {
      return res.status(400).json({
        mensagem: 'Email e/ou senha inválidos.',
      });
    }
    const usuario = usuarios[0];

    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

    if (!senhaVerificada) {
      return res.status(400).json({
        mensagem: 'Email e/ou senha inválidos.',
      });
    }

    const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.status(200).json({ token: token });
  } catch (error) {
    return res.json({
      mensagem: error.message,
    });
  }
}

async function detalharUsuario(req, res) {
  const { user } = req;

  if (!user) {
    return res.status(400).json({
      mensagem: 'Não foi possível acessar este usuário.',
    });
  }
  return res.status(200).json(user);
}

async function atualizarUsuario(req, res) {
  const { nome, nome_loja, email, senha } = req.body;
  const { user } = req;

  try {
    await signUpSchema.validate(req.body);

    const queryEmail = 'select * from usuarios where email = $1';
    const { rowCount } = await connection.query(queryEmail, [email]);
    if (rowCount > 0) {
      return res.status(400).json({
        mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.',
      });
    }
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
  const senhaCriptografada = await bcrypt.hash(senha, 10);
  try {
    const queryUpdate =
      'update usuarios set nome = $1, nome_loja = $2, email = $3, senha = $4 where id = $5';
    const { rowCount } = await connection.query(queryUpdate, [
      nome,
      nome_loja,
      email,
      senhaCriptografada,
      user.id,
    ]);
    if (rowCount === 0) {
      return res.status(400).json({
        mensagem: 'Não foi possível atualizar este usuário.',
      });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(400).json({
      mensagem: 'Não foi possível realizar o cadastro.',
    });
  }
}
module.exports = { cadastrarUsuario, login, detalharUsuario, atualizarUsuario };
