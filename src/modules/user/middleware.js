import _ from 'lodash';
import passport from 'passport';
import validate from 'validate.js';
import constraints from './validation';
import utils from '../../../common/utils';
import { loginError } from './messages';
import { AuthorizationError, BadRequestError } from '../../../common/errors';

export const ROLE_ALL = '*';

/**
 * Auth middleware
 * @param {array} roles
 * @param {string|function} failedCb
 */
export function auth(roles, failedCb) {
  const reject = (req, res, next) => {
    if (utils.isFunction(failedCb)) return failedCb(req, res);
    const err = new AuthorizationError('Access denied.');
    return next(err);
  };

  return (req, res, next) => {
    if (req.isAuthenticated()) {
      if (!roles || roles === ROLE_ALL) return next();

      roles = utils.isArray(roles) ? roles : [roles];
      const user = req.user || {};
      // fix role
      if (_.includes(roles, user.role)) return next();
    }

    return reject(req, res);
  };
}

export function loginAuth() {
  return (req, res, next) => {
    passport.authenticate('local-login', (err, user) => {
      if (err) return next(err);
      if (!user) {
        err = loginError('user', 'wrong_password');
        return next(err);
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
}

export function jwtAuth() {
  return (req, res, next) => {
    passport.authenticate('jwt', (err, user) => {
      if (err) return next(err);
      if (!user) {
        err = new AuthorizationError('Unauthorized');
        return next(err);
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
}

/**
 * Login form validation middleware
 */
export function validateLogin() {
  return (req, res, next) => {
    const hasError = validate(req.body, constraints.login);
    if (hasError) {
      next(new BadRequestError('Login failed', hasError));
    }
    return next();
  };
}
