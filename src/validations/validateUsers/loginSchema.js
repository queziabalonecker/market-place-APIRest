const yup = require('../config');

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  senha: yup.string().required().min(5).max(10),
});

module.exports = loginSchema;
