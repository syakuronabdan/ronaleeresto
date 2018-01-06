import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { User } from './model';
import { jwt as jwtOptions, crypto } from '../../../config';
import { getUserError } from './messages';
import { UserEmail } from './email';

export const UserController = {};
export default { UserController };

UserController.getUser = async (req, res, next) => {
  let profile = req.user;
  if (req.params.id) {
    profile = await User.findById(req.params.id);
  }


  if (!profile) {
    return next(getUserError('user', 'not_found'));
  }

  if (req.route.path === '/users/login') {
    const payload = { user_id: profile.user_id };
    profile.token = jwt.sign(payload, jwtOptions.secretOrKey);
  }
  delete profile.password;
  return res.API.success('User Data', profile);
};

UserController.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (user) {
    // generate activation token
    const data = {
      email: user.email,
    };
    const token = CryptoJS.AES.encrypt(JSON.stringify(data), crypto.secret);

    // send reset password link
    UserEmail.sendForgotPassword(user, token.toString());
    return res.API.success('Email sent');
  }
  return next(getUserError('user', 'not_found'));
};
