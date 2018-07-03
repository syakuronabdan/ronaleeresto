const path = require('path');
const cfg = require('../common/config');

const def = {};

// setup default env
def.env = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = def.env;

def.debug = true;
def.https = false;
def.cookie_expires = 3600 * 48 * 1000; // 2 days
def.host = 'localhost';
def.port = 4000;

// session secret
def.secret = 'project';

// sequelize config
def.sequelize = {};
def.sequelize.debug = false;
def.sequelize.username = 'root';
def.sequelize.password = '';
def.sequelize.database = 'ronaleerestodb';
def.sequelize.host = '127.0.0.1';
def.sequelize.port = 3306;
def.sequelize.dialect = 'mysql';

// paths
const rootDir = path.dirname(__dirname);
def.publicPath = path.join(rootDir, 'public');
def.cachePath = path.join(rootDir, 'cache');
def.tempPath = path.join(rootDir, 'temp');
def.logPath = path.join(rootDir, 'logs/log');
def.imagePath = path.join(rootDir, 'public/image');
def.loginPath = '/login';

def.cdnPath = 'http://cdn.localhost.com';

// jwt config
def.jwt = {};
def.jwt.secretOrKey = 'MY-APP';
def.jwt.issuer = 'pionize.com';
def.jwt.audience = 'pionize.com';

// crypto config
def.crypto = {};
def.crypto.secret = 'MY-APP';

// mailer config
def.emailServiceAdapter = 'sendgrid';

// sentry config
def.sentry = {};
def.sentry.enable = false;
def.sentry.dsn = '';

// url builder
def.url = (dir = '/') => {
  const port = ((def.https && def.port !== 443) || (!def.https && def.port !== 80)) ? `:${def.port}` : '';
  return `http${def.https ? 's' : ''}://${def.host}${port}${dir}`;
};

// sendgrid config
def.sendgrid = {};
def.sendgrid.fromEmail = 'noreply@example.com';
def.sendgrid.apiKey = '';
def.sendgrid.params = {};

cfg.resolveLocalConfig(__dirname, (err, file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  if (!err) cfg.merge(def, require(file));
});

module.exports = def;
