import validate from 'validate.js';
import multer from 'multer';
import path from 'path';
import md5 from 'md5';
import _ from 'lodash';
import config from '../../../config';
import { BadRequestError } from '../../../common/errors';
import constraints from './validation';

const upload = multer().array('images');

const getImageType = (body) => {
  switch (body.type) {
    case 'activity':
      body.is_single = false;
      break;
    case 'profile':
      body.is_single = true;
      break;
    case 'cover':
      body.is_single = true;
      break;
    case 'group':
      body.is_single = true;
      break;
    case 'story':
      body.is_single = false;
      break;
    default:
      break;
  }
  // body.folder = config.imageFolder[body.type];
};

export function validateParam() {
  return (req, res, next) => {
    upload(req, res, () => {
      getImageType(req.body);
      req.body.images = req.files;
      const hasError = validate(req.body, constraints.upload);
      if (hasError) {
        const err = new BadRequestError('Invalid parameter');
        err.data = hasError;
        return next(err);
      }
      if (req.body.is_single && req.files.length !== 1) {
        const err = new BadRequestError('Must single images');
        return next(err);
      }
      return next();
    });
  };
}

export function imagePath() {
  return (req, res, next) => {
    const body = req.body;
    body.images = _.map(body.images, (image, i) => {
      image.filename = `${body.type}_${(md5(req.user.user_id + Date.now())).substr(0, 10)}${(md5(Date.now())).substr(3, 20)}_${i}`;
      image.destination = req.type === 'image' ? config.imagePath : config.videoPath;
      image.path = `${image.destination}/${image.filename}${path.extname(image.originalname)}`;
      image.original = `${image.destination}/${image.filename}-original${path.extname(image.originalname)}`;
      image.filename = `${image.filename}${path.extname(image.originalname)}`;
      return image;
    });
    return next();
  };
}
