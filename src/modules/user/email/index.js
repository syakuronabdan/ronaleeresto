import path from 'path';
import config from '../../../../config';
import mailer from '../../mailer';

export const UserEmail = {};
export default { UserEmail };
const mail = mailer.service;

UserEmail.sendForgotPassword = async (user, token) => {
  const arg = Object.assign({}, { user: user.toJSON() }, { token }, { config });
  const view = mail.template(path.join(__dirname, 'templates/reset-password.pug'), arg);
  const subject = 'Reset Password';
  mail.send(user.email, subject, view);
};
