import express from 'express';
import { auth, noUser } from './middleware';
import { UserController } from './controller';
import core from '../core';

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

export default routes;

