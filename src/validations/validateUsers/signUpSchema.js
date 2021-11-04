const yup = require('../config');

const signUpSchema = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().email().required(),
  senha: yup.string().required().min(5).max(10),
  nome_loja: yup.string().required(),
});

module.exports = signUpSchema;
