import passport from 'passport';
import config from '../../../config';
import { User } from './model/user';
import { error } from '../core/utils';
import { Messages } from './messages';

export const UserController = {};
export default { UserController };

/**
 * Display user login form
 */
UserController.loginForm = (req, res) => {
  const { redirect = '/' } = req.query;
  res.render('user/views/login', { action: `${config.loginPath}?redirect=${redirect}` });
};

UserController.logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/login');
};

UserController.dashboard = (req, res) => {
  res.render('user/views/dashboard');
};

UserController.login = (req, res, next) => {
  passport.authenticate('local-login', (err, user) => {
    if (err || !user) {
      return next(error('danger', 'Invalid username or password'));
    }
    return req.logIn(user, (e) => {
      if (e) return next(error('danger', 'Invalid username or password'));
      const { redirect = '/' } = req.query;
      return res.redirect(redirect);
    });
  })(req, res, next);
};
