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

module.exports = routes;
