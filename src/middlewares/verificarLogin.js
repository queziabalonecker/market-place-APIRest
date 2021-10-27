const conexao = require('../conexao');
const jwt = require('jsonwebtoken');

const verificarLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.',
    });
  }
  const token = authorization.replace('Bearer', '').trim();

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.',
    });
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const query = 'select * from usuarios where id = $1';
    const { rows: usuarios, rowCount } = await conexao.query(query, [id]);
    if (rowCount === 0) {
      return res.json(404).json({
        mensagem: 'Usuário não existe.',
      });
    }
    const { senha, ...usuario } = usuarios[0];
    req.usuario = usuario;
    next();
  } catch (error) {
    return {
      mensagem: error.message,
    };
  }
};

module.exports = verificarLogin;
