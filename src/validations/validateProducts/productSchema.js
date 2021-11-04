const yup = require('../config');

const productSchema = yup.object().shape({
  nome: yup.string().required(),
  quantidade: yup.number().strict().required(),
  categoria: yup.string(),
  preco: yup.number().strict().required(),
  descricao: yup.string().required(),
  imagem: yup.string(),
});

module.exports = productSchema;
