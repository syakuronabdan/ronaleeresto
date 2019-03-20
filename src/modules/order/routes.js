const express = require('express');
const { OrderController } = require('./controller');
const user = require('../user');
const core = require('../core');

const routes = express.Router();
const { wrap } = core.utils;
const { auth } = user.middleware;

/**
 * POST /orders
 * Create an order
 */
routes.post('/orders',
  auth(),
  // validateCreate(),
  wrap(OrderController.createOrder));

/**
 * GET /orders/:id*?
 * Create view user order
 */
routes.get('/orders/',
  auth(),
  wrap(OrderController.getOrder));

/**
 * GET /orders/cook
 * View users orders
 */
routes.get('/orders/cook',
  auth(),
  wrap(OrderController.cookOrder));

routes.patch('/orders/cook/:id([0-9]{1,10})',
  auth(),
  wrap(OrderController.orderDone));

routes.get('/orders/pay',
  auth(),
  wrap(OrderController.payOrder));

routes.patch('/orders/pay/:id([0-9]{1,10})',
  auth(),
  wrap(OrderController.orderPaid));

routes.get('/orders/cookOrdersFrom/:id([0-9]{1,10})',
  auth(),
  wrap(OrderController.getCookOrdersFrom));

routes.get('/orders/payOrdersFrom/:id([0-9]{1,10})',
  auth(),
  wrap(OrderController.getPayOrdersFrom));

module.exports = routes;
