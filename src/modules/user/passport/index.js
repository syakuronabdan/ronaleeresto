const passport = require('passport');
const local = require('./strategy/local');
const { User } = require('../model');

const configure = function configure(app) {
  // eslint-disable-next-line no-underscore-dangle
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser((id, done) => new User({ user_id: id })
    .fetch()
    .then(user => done(null, user.toJSON())));
  passport.use('local-login', local);

  // add passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
}


module.exports = { configure };
