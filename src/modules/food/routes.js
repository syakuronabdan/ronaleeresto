import express from 'express';
import { ProductController } from './controller';
import core from '../core';

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

export default routes;
