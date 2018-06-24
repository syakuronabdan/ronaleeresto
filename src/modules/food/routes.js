const express = require('express');
const { ProductController } = require('./controller');
const core = require('../core');

const routes = express.Router();
const { wrap } = core.utils;

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

module.exports = routes;
