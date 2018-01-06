import _ from 'lodash';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, UserStatus } from '../../model';
import { loginError } from '../../messages';

export default new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false,
}, async (email, password, done) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return done(loginError('email', 'email_not_found', true), false);
  if (user.checkPassword(password)) {
    if (_.includes([UserStatus.INACTIVE], user.status)) {
      return done(loginError('user', 'user_not_active', true), false);
    }
    return done(null, user.toJSON());
  }
  return done(loginError('password', 'wrong_password', true), false);
});
