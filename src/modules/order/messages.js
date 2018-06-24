const core = require('../core');

const { formatError } = core.utils;

const errMsg = {
  createOrderMsg: {
    product_not_found: 'Product tidak ditemukan',
  },
};

const loginError = formatError.bind(errMsg.loginMsg);
const createOrderError = formatError.bind(errMsg.createOrderMsg);

module.exports = { errMsg, loginError, createOrderError };
