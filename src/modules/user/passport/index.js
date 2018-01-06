import passport from 'passport';
import local from './strategy/local';
import jwt from './strategy/jwt';
import { User } from '../model';

function configure(app) {
  // eslint-disable-next-line no-underscore-dangle
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser((id, done) => new User({ user_id: id })
    .fetch()
    .then(user => done(null, user.toJSON())));
  passport.use('local-login', local);
  passport.use('jwt', jwt);

  // add passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
}

export default { configure };
