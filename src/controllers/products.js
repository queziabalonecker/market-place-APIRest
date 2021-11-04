const connection = require('../db_connection');
const productSchema = require('../validations/validateProducts/productSchema');

async function cadastrarProduto(req, res) {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { user } = req;

  try {
    await productSchema.validate(req.body);

    const registerQuery =
      'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
    const { rowCount } = await connection.query(registerQuery, [
      user.id,
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
    ]);
    if (rowCount === 0) {
      return res.status(400).json({
        mensagem: 'Não foi possível cadastrar o produto.',
      });
    }
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}

async function listarProdutos(req, res) {
  const { user } = req;
  const { category } = req.query;

  try {
    if (category) {
      const filterQuery = `select * from produtos where usuario_id = $1 and categoria ilike $2`;
      const { rows } = await connection.query(filterQuery, [user.id, category]);
      return res.status(200).json(rows);
    }
    const query = 'select * from produtos where usuario_id = $1';
    const { rows } = await connection.query(query, [user.id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({
      mensagem: error.message,
    });
  }
}

async function detalharProduto(req, res) {
  const { user } = req;
  const { id } = req.params;

  try {
    const query = 'select * from produtos where id = $1 and usuario_id = $2';
    const { rows, rowCount } = await connection.query(query, [id, user.id]);
    if (rowCount === 0) {
      return res.status(404).json({
        mensagem: `Não existe produto cadastrado com o id ${id}`,
      });
    }
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}

async function atualizarProduto(req, res) {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { user } = req;
  const { id } = req.params;

  try {
    await productSchema.validate(req.body);

    const query = 'select * from produtos where id = $1 and usuario_id = $2';
    const { rowCount: quantidadeProdutos } = await connection.query(query, [id, user.id]);
    if (quantidadeProdutos === 0) {
      return res.status(404).json({
        mensagem: `Não existe produto cadastrado com o id ${id} deste usuário.`,
      });
    }
    const queryUpdate =
      'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8';
    const { rowCount } = await connection.query(queryUpdate, [
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
      id,
      user.id,
    ]);
    if (rowCount === 0) {
      return res.status(400).json({
        mensagem: 'Não foi possível atualizar este produto.',
      });
    }
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({
      mensagem: error.message,
    });
  }
}

async function excluirProduto(req, res) {
  const { user } = req;
  const { id } = req.params;

  try {
    const query = 'select * from produtos where id = $1 and usuario_id = $2';
    const { rowCount } = await connection.query(query, [id, user.id]);
    if (rowCount === 0) {
      return res.status(404).json({
        mensagem: `Não existe produto para o id ${id}`,
      });
    }
    const queryDelete = 'delete from produtos where id = $1 and usuario_id = $2';
    const { rowCount: produtosDeletados } = await connection.query(queryDelete, [id, user.id]);
    if (produtosDeletados === 0) {
      return res.status(401).json({
        mensagem: 'Não é possível excluir este produto.',
      });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({
      mensagem: error.message,
    });
  }
}

module.exports = {
  cadastrarProduto,
  listarProdutos,
  detalharProduto,
  atualizarProduto,
  excluirProduto,
};
