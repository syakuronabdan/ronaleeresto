const express = require('express');
const { OrderController } = require('./controller');
const user = require('../user');
const { validateCreate, validateGet } = require('./middleware');
const core = require('../core');

const routes = express.Router();
const { wrap } = core.utils;
const { auth } = user.middleware;

/**
 * POST /order
 * Create an order
 */
routes.post('/orders',
  auth(),
  // validateCreate(),
  wrap(OrderController.createOrder));

/**
 * GET /order/:id*?
 * View user order
 */
routes.get('/orders/:id*?',
  auth(),
  wrap(OrderController.getOrder));

module.exports = routes;
