const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
  const { nome, nome_loja, email, senha } = req.body;
  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório.',
    });
  }
  if (!nome_loja) {
    return res.status(400).json({
      mensagem: 'O campo nome_loja é obrigatório.',
    });
  }
  if (!email) {
    return res.status(400).json({
      mensagem: 'O campo email é obrigatório.',
    });
  }
  if (!senha) {
    return res.status(400).json({
      mensagem: 'O campo senha é obrigatório.',
    });
  }
  try {
    const queryEmail = 'select * from usuarios where email = $1';
    const { rowCount } = await conexao.query(queryEmail, [email]);
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
    const { rowCount } = await conexao.query(queryCadastro, [
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
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email) {
    return res.status(400).json({
      mensagem: 'O campo email é obrigatório.',
    });
  }
  if (!senha) {
    return res.status(400).json({
      mensagem: 'O campo senha é obrigatório.',
    });
  }

  try {
    const queryEmail = 'select * from usuarios where email = $1';
    const { rows: usuarios, rowCount: quantidadeUsuarios } = await conexao.query(queryEmail, [
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
};

const detalharUsuario = async (req, res) => {
  const { usuario } = req;

  if (!usuario) {
    return res.status(400).json({
      mensagem: 'Não foi possível acessar este usuário.',
    });
  }
  return res.status(200).json(usuario);
};

const atualizarUsuario = async (req, res) => {
  const { nome, nome_loja, email, senha } = req.body;
  const { usuario } = req;
  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório.',
    });
  }
  if (!nome_loja) {
    return res.status(400).json({
      mensagem: 'O campo nome_loja é obrigatório.',
    });
  }
  if (!email) {
    return res.status(400).json({
      mensagem: 'O campo email é obrigatório.',
    });
  }
  if (!senha) {
    return res.status(400).json({
      mensagem: 'O campo senha é obrigatório.',
    });
  }
  try {
    const queryEmail = 'select * from usuarios where email = $1';
    const { rowCount } = await conexao.query(queryEmail, [email]);
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
    const { rowCount } = await conexao.query(queryUpdate, [
      nome,
      nome_loja,
      email,
      senhaCriptografada,
      usuario.id,
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
};
module.exports = { cadastrarUsuario, login, detalharUsuario, atualizarUsuario };
