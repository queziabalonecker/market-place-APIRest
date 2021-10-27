const conexao = require('../conexao');

const cadastrarProduto = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;
  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório.',
    });
  }
  if (!quantidade) {
    return res.status(400).json({
      mensagem: 'O campo quantidade é obrigatório.',
    });
  }
  if (!preco) {
    return res.status(400).json({
      mensagem: 'O campo preço é obrigatório.',
    });
  }
  if (!descricao) {
    return res.status(400).json({
      mensagem: 'O campo descricao é obrigatório.',
    });
  }
  try {
    const queryCadastro =
      'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
    const { rowCount } = await conexao.query(queryCadastro, [
      usuario.id,
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
};

const listarProdutos = async (req, res) => {
  const { usuario } = req;
  const { categoria } = req.query;

  try {
    if (categoria) {
      const queryFiltro = `select * from produtos where usuario_id = $1 and categoria ilike $2`;
      const { rows } = await conexao.query(queryFiltro, [usuario.id, categoria]);
      return res.status(200).json(rows);
    }
    const query = 'select * from produtos where usuario_id = $1';
    const { rows } = await conexao.query(query, [usuario.id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).json({
      mensagem: error.message,
    });
  }
};

const detalharProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const query = 'select * from produtos where id = $1 and usuario_id = $2';
    const { rows, rowCount } = await conexao.query(query, [id, usuario.id]);
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
};

const atualizarProduto = async (req, res) => {
  const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
  const { usuario } = req;
  const { id } = req.params;
  if (!nome) {
    return res.status(400).json({
      mensagem: 'O campo nome é obrigatório.',
    });
  }
  if (!quantidade) {
    return res.status(400).json({
      mensagem: 'O campo quantidade é obrigatório.',
    });
  }
  if (!preco) {
    return res.status(400).json({
      mensagem: 'O campo preço é obrigatório.',
    });
  }
  if (!descricao) {
    return res.status(400).json({
      mensagem: 'O campo descricao é obrigatório.',
    });
  }
  try {
    const query = 'select * from produtos where id = $1 and usuario_id = $2';
    const { rowCount: quantidadeProdutos } = await conexao.query(query, [id, usuario.id]);
    if (quantidadeProdutos === 0) {
      return res.status(404).json({
        mensagem: `Não existe produto cadastrado com o id ${id} deste usuário.`,
      });
    }
    const queryUpdate =
      'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8';
    const { rowCount } = await conexao.query(queryUpdate, [
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
      id,
      usuario.id,
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
};

const excluirProduto = async (req, res) => {
  const { usuario } = req;
  const { id } = req.params;

  try {
    const query = 'select * from produtos where id = $1 and usuario_id = $2';
    const { rowCount } = await conexao.query(query, [id, usuario.id]);
    if (rowCount === 0) {
      return res.status(404).json({
        mensagem: `Não existe produto para o id ${id}`,
      });
    }
    const queryDelete = 'delete from produtos where id = $1 and usuario_id = $2';
    const { rowCount: produtosDeletados } = await conexao.query(queryDelete, [id, usuario.id]);
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
};

module.exports = {
  cadastrarProduto,
  listarProdutos,
  detalharProduto,
  atualizarProduto,
  excluirProduto,
};
