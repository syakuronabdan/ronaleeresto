import core from '../core';

const { formatError } = core.utils;

export const errMsg = {
  upload: {
    title: 'Upload image gagal',
    error: 'Gagal menambah image',
  },
};

export const uploadError = formatError.bind(errMsg.upload);
