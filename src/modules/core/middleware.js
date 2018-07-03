require('winston-daily-rotate-file');
const moment = require('moment');
const ch = require('chalk');
const morgan = require('morgan');
const winston = require('winston');
const validate = require('validate.js');
const config = require('../../../config');
const { error } = require('./utils');

/**
 * Request logger middleware
 * @return {function}
 */
const requestLoggerMiddleware = function requestLoggerMiddleware() {
  const logger = new (winston.Logger)({
    transports: [
      new winston.transports.DailyRotateFile({
        filename: config.logPath,
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        level: 'debug',
        timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
        json: false,
      }),
    ],
  });

  logger.stream = {
    write: (message) => {
      logger.info(message);
    },
  };
  morgan.token('body', (req, res) => `\nrequest header: ${JSON.stringify(req.headers, null, 2)}\nrequest body: ${JSON.stringify(req.body, null, 2)}\nresponse body: ${JSON.stringify(res.APIResponse, null, 2)}`);
  return morgan(`${ch.red(':method')} ${ch.green(':url')} ${ch.yellow(':response-time ms')} :body`, { stream: logger.stream });
};

/**
 * Add some utilities to request object
 * @return {function}
 */
const requestUtilsMiddleware = function requestUtilsMiddleware() {
  return (req, res, next) => {
    req.messages = {
      errors: [],
      warnings: [],
      validation: {},
    };
    next();
  };
};

// eslint-disable-next-line no-unused-vars
const apiResponse = function apiResponse() {
  return (req, res) => {
    const code = res.statusCode;
    const { status = true, meta, input, link, data = {} } = req.resData || {};
    if (input) {
      data.input = Object.keys(input).map(name => ({ name, val: input[name] }));
      data.link = link;
    }
    return res.json({
      code,
      status,
      meta,
      data,
    });
  };
};

/**
 * @param {object} constraint
 * @param {(html|json)} type error format
 */
const validateParam = (constraint, { type } = {}) => (req, res, next) => {
  const hasError = validate(req.body, constraint, { format: 'flat' });
  if (hasError) return next(error('danger', hasError, { type }));
  return next();
};

const errorFlash = () => (err, req, res, next) => {
  const { type, redirect, alert, msg } = err;
  if (type === 'json') {
    const msg2 = Array.isArray(msg) ? msg.join(', ') : msg;
    return res.status(400).json({ msg: msg2, alert });
  }
  if (!alert) console.log('util', err);
  if (!alert) return res.render('core/views/errors/500');
  req.flash(alert, msg);
  return res.redirect(redirect);
};

module.exports = {
  requestLoggerMiddleware,
  requestUtilsMiddleware,
  apiResponse,
  errorFlash,
  validateParam,
};
