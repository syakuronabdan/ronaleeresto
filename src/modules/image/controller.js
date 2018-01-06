import fs from 'fs';
import sharp from 'sharp';
import _ from 'lodash';
import Promise from 'bluebird';
import { uploadError } from './messages';
// import config from '../../../config';

export const ImageController = {};
export default { ImageController };

ImageController.upload = async (req, res) => {
  const images = req.body.images;
  const names = [];
  const promises = _.map(images, (image) => {
    names.push({ name: image.filename });
    return new Promise(async (resolve, reject) => {
      try {
        if (req.type === 'image') {
          const data = await sharp(image.buffer).rotate().resize(400).toBuffer();
          fs.writeFile(image.path, data, (err) => {
            if (err) reject(err);
            fs.writeFile(image.original, image.buffer, (err1) => {
              if (err1) reject(err1);
              resolve();
            });
          });
        } else {
          fs.writeFile(image.path, image.buffer, (err1) => {
            if (err1) reject(err1);
            resolve();
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  });

  await Promise.all(promises).catch(() => {
    throw uploadError('image', 'error');
  });

  const data = req.type === 'image' ? { images: names } : { videos: names };
  return res.API.success('Upload success', data);
};
