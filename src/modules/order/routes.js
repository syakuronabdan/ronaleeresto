import express from 'express';
import { OrderController } from './controller';
import user from '../user';
import { validateCreate, validateGet } from './middleware';
import core from '../core';

const routes = express.Router();
const { wrap } = core.utils;
const { jwtAuth } = user.middleware;

/**
 * POST /order
 * Create an order
 */
routes.post('/orders',
  jwtAuth(),
  validateCreate(),
  wrap(OrderController.createOrder));

/**
 * GET /order/:id*?
 * View user order
 */
routes.get('/orders/:id*?',
  jwtAuth(),
  validateGet(),
  wrap(OrderController.getOrder));

export default routes;
