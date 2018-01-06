import express from 'express';
import { ImageController } from './controller';
import core from '../core';
import { validateParam, imagePath } from './middleware';
import user from '../user';

const routes = express.Router();
const { wrap } = core.utils;
const { jwtAuth } = user.middleware;

/**
 * POST /images
 * Upload multi images
 */
routes.post('/images',
  jwtAuth(),
  (req, res, next) => {
    req.type = 'image';
    return next();
  },
  validateParam(),
  imagePath(),
  wrap(ImageController.upload));

routes.post('/videos',
  jwtAuth(),
  (req, res, next) => {
    req.type = 'video';
    return next();
  },
  validateParam(),
  imagePath(),
  wrap(ImageController.upload));

export default routes;
