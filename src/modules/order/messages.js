import core from '../core';

const { formatError } = core.utils;

export const errMsg = {
  createOrderMsg: {
    product_not_found: 'Product tidak ditemukan',
  },
};

export const loginError = formatError.bind(errMsg.loginMsg);
export const createOrderError = formatError.bind(errMsg.createOrderMsg);
