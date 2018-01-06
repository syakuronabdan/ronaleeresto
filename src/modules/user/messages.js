import core from '../core';

const { formatError } = core.utils;

export const errMsg = {
  loginMsg: {
    title: 'Login gagal',
    wrong_password: 'Email atau password yang kamu masukkan salah, silahkan coba lagi',
    bad_request: 'Bad request',
    password_presence: '^Password harus diisi',
    email_presence: '^Email harus diisi',
    email_not_valid: '^Email tidak valid',
    email_not_found: 'Email tidak terdaftar',
    provName_presence: '^Provider name harus diisi',
    uid_presence: '^Provider uid harus diisi',
    token_presence: '^Access token harus diisi',
    user_not_active: '^User belum aktif',
  },
  getUserMsg: {
    title: 'Get user gagal',
    not_found: 'User tidak terdaftar',
  },
  authorized: {
    unauthorized: 'Unauthorized',
  },
};

export const loginError = formatError.bind(errMsg.loginMsg);
export const getUserError = formatError.bind(errMsg.getUserMsg);
export const authorizedError = formatError.bind(errMsg.authorized);
