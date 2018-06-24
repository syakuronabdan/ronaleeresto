const _ = require('lodash');
const cfg = require('../../../config');
const { BadRequestError } = require('../../../common/errors');


/**
 * Wrap controller function
 * @param {function} fn
 */
const wrap = function wrap(fn) {
  return (...args) => {
    try {
      const result = fn(...args);
      if (result && _.isFunction(result.catch)) {
        result.catch(args[2]);
      }

      return result;
    } catch (e) {
      return args[2](e);
    }
  };
}

/**
 * Wrapper function for config
 * @param {string} key
 * @param {*} defaultValue
 */
const config = function config(key, defaultValue) {
  if (cfg[key] === undefined) {
    return defaultValue;
  }

  return cfg[key];
}

/**
 * Format error other than validate.js, for consistent error response.
 * Singular because once the error encountered the api will throw the error,
 * thus not allowing it to have multiple error messages
 * @param obj {string} the object property of the message
 * @param message {string}
 */
const formatSingularErr = function formatSingularErr(obj, message) {
  return { [obj]: [message] };
}

/**
 * Format bad request error
 * @param field {string} field that causes error
 * @param msg {string} message of the error
 */
const formatError =  function formatError(field, msg) {
  const data = formatSingularErr(field, this[msg]);
  return new BadRequestError(this[msg], data);
}

const error = (flashType, msg, { redirect = 'back', type = 'html' } = {}) => ({ alert: flashType, msg, redirect, type });

module.exports = { wrap, config, formatSingularErr, formatError, error };
