const express = require('express');
const { ProductController } = require('./controller');
const core = require('../core');
const { auth, noUser } = require('../user/middleware');
const { UserRoles } = require('../user/model');
const { constraints } = require('./validation');


const routes = express.Router();
const { wrap } = core.utils;
const { validateParam } = core.middleware;


/**
 * GET /product/:id
 * View user profile
 */
routes.get('/products/:id',
  wrap(ProductController.getProductById));

/**
 * GET /profile
 * View user profile
 */
routes.get('/products',
  wrap(ProductController.getAllProduct));

routes.get('/admin/menus',
  auth([UserRoles.ADMIN]),
  ProductController.viewAll);

routes.get('/admin/menus/add',
  auth([UserRoles.ADMIN]),
  ProductController.createView);

routes.post('/admin/menus/add',
  auth([UserRoles.ADMIN]),
  validateParam(constraints.create),
  wrap(ProductController.create));

routes.get('/admin/menus/edit/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  wrap(ProductController.editView('/admin/menus', 'edit')));

routes.post('/admin/menus/edit/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  validateParam(constraints.edit),
  wrap(ProductController.edit('/admin/menus')));

routes.get('/admin/menus/delete/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  wrap(ProductController.delete));

routes.get('/admin/categories',
  auth([UserRoles.ADMIN]),
  ProductController.viewAll);

routes.get('/admin/categories/add',
  auth([UserRoles.ADMIN]),
  ProductController.createView);

routes.post('/admin/categories/add',
  auth([UserRoles.ADMIN]),
  validateParam(constraints.create),
  wrap(ProductController.create));

routes.get('/admin/categories/edit/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  wrap(ProductController.editView('/admin/categories', 'edit')));

routes.post('/admin/categories/edit/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  validateParam(constraints.edit),
  wrap(ProductController.edit('/admin/categories')));

routes.get('/admin/categories/delete/:id([0-9]+)',
  auth([UserRoles.ADMIN]),
  wrap(ProductController.deleteCategory));

module.exports = routes;
