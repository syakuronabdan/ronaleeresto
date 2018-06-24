const config = require('../../../config');

const ROLE_ALL = '*';

/**
 * Auth middleware
 * @param {array} roles
 */
const auth = (perm = ROLE_ALL, redirect = '/') => (req, res, next) => {
  if (req.isAuthenticated()) {
    if (perm === ROLE_ALL) return next();
    if (req.session.permissions.includes(perm)) return next();
    req.flash('danger', 'You don\'t have permission to access/do that');
    return res.redirect(redirect);
  }
  return res.redirect(`${config.loginPath}?redirect=${req.originalUrl || '/'}`);
};

/**
 * Make sure only non authenticated user can access the route
 */
const noUser = () => (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return next();
};

module.exports = { ROLE_ALL, auth, noUser };
