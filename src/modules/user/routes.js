const express = require('express');
const { auth, noUser } = require('./middleware');
const { UserController } = require('./controller');
const { UserRoles } = require('./model');
const { constraints } = require('./validation');
const core = require('../core');

const routes = express.Router();
const { wrap } = core.utils;
const { validateParam } = core.middleware;

routes.get('/admin',
  auth([UserRoles.ADMIN]),
  UserController.dashboard);

// create users form
routes.get('/admin/users/add',
  auth([UserRoles.ADMIN]),
  UserController.createView);

// create users
routes.post('/admin/users/add',
  auth([UserRoles.ADMIN]),
  validateParam(constraints.create),
  wrap(UserController.create));

routes.get('/admin/users/edit/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  wrap(UserController.editView('/admin/users', 'edit')));

routes.post('/admin/users/edit/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  validateParam(constraints.edit),
  wrap(UserController.edit('/admin/users')));

routes.get('/admin/users',
  auth([UserRoles.ADMIN]),
  UserController.viewAll);

routes.get('/admin/users/delete/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  wrap(UserController.delete));

routes.get('/',
  auth([UserRoles.WAITER, UserRoles.CASHIER, UserRoles.COOK]),
  UserController.noAdminDashboard);

routes.get('/logout',
  UserController.logout);

routes.get('/login',
  noUser(),
  UserController.loginForm);

routes.post('/login',
  UserController.login);

module.exports = routes;
