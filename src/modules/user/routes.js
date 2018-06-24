const express = require('express');
const { auth, noUser } = require('./middleware');
const { UserController } = require('./controller');
const core = require('../core');

const routes = express.Router();
const { wrap } = core.utils;

routes.get('/',
  auth(),
  UserController.dashboard);

routes.get('/logout',
  UserController.logout);

routes.get('/login',
  noUser(),
  UserController.loginForm);

routes.post('/login',
  UserController.login);

module.exports = routes;
