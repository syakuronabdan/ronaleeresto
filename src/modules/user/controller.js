const passport = require('passport');
const config = require('../../../config');
const { User, UserRoles } = require('./model/user');
const { error, capitalize } = require('../core/utils');
const { userMsg } = require('./messages');

const listRoles = (roles) => {
  const result = Object.keys(roles)
    .map(role => ({ id: roles[role], name: capitalize(role) }));
  result.unshift({ id: 0, name: 'Select role...' });
  return result;
};

const UserController = {};

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
      let { redirect } = req.query;
      redirect = redirect || user.role === UserRoles.ADMIN ? '/admin' : '/';
      req.session.userRole = user.role;
      return res.redirect(redirect);
    });
  })(req, res, next);
};

UserController.createView = async (req, res) => {
  const roles = listRoles(UserRoles);
  res.render('user/views/createUser', { link: '/admin/users', type: 'add', roles });
};

UserController.create = async (req, res) => {
  const { email, role } = req.body;
  const name = capitalize(req.body.name);
  const password = User.hashPasswordSync(req.body.password);
  const user = await User.get({ email });
  if (user) throw error('danger', userMsg.create_duplicate);
  await User.create({ name, email, password, role, user_id: req.user.id });
  req.flash('success', userMsg.create_success(name));
  return res.redirect('/admin/users');
};

UserController.editView = (link, type) => async (req, res) => {
  const user = await User.get({ id: req.params.id });
  const roles = listRoles(UserRoles);
  if (!user) throw error('danger', userMsg.not_found, { redirect: link });
  return res.render('user/views/createUser', { link, type, roles, person: user.serialize() });
};

UserController.edit = redirect => async (req, res) => {
  const { email, role } = req.body;
  const name = capitalize(req.body.name);
  const password = req.body.password ? User.hashPasswordSync(req.body.password) : '';
  const [check, user] = await Promise.all([User.get({ email }), User.get({ id: req.params.id })]);
  if (check && check.get('id') !== user.get('id')) throw error('danger', userMsg.create_duplicate);
  if (!user) throw error('danger', userMsg.not_found, { redirect });
  const update = { name, email, role };
  if (password) update.password = password;
  await User.update(update, { where: { id: req.params.id } });
  req.flash('success', userMsg.edit_success);
  return res.redirect(redirect);
};

UserController.viewAll = async (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const users = await User.getWithPage({}, { page, pageSize });
  return res.render('user/views/viewUser', {
    ...users.pagination,
    link: '/admin/users',
    users: users.data,
  });
};

UserController.delete = async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  req.flash('success', userMsg.delete_success);
  return res.redirect('/admin/users');
};

module.exports = { UserController };
