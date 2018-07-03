const cfg = require('../../../config');
const { BadRequestError } = require('../../../common/errors');


/**
 * Wrap controller function
 * @param {function} fn
 */
const wrap = fn => (req, res, next) => fn(req, res, next).catch((e) => {
  next(e);
});

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
};

const capitalize = (str) => {
  if (!str) return '';
  if (Array.isArray(str)) return str.map(s => s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()));
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const error = (flashType, msg, { redirect = 'back', type = 'html' } = {}) => ({ alert: flashType, msg, redirect, type });
const errorJSON = (flashType, msg, { redirect = 'back' } = {}) => ({ alert: flashType, msg, redirect, type: 'json' });

const formatCurrency = (format, curr) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: format,
  currencyDisplay: 'code',
  minimumFractionDigits: 2,
}).format(curr);

module.exports = { wrap, config, error, errorJSON, formatCurrency, capitalize };
