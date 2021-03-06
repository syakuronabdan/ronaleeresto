require('babel-polyfill');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
// const statusMonitor = require('express-status-monitor');
const responseTime = require('response-time');
const config = require('../config');
const c = require('./constants');
const core = require('./modules/core');
const user = require('./modules/user');
const order = require('./modules/order');
const food = require('./modules/food');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.io = io;

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection:', err.stack);
});

// app.use(statusMonitor());
app.use(responseTime());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(config.publicPath, { maxAge: c.ONE_YEAR }));

app.set('trust proxy', 1);
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: config.https, maxAge: config.cookie_expires },
}));

// configure passport middleware
// this must be defined after session middleware
// see: http://passportjs.org/docs#middleware
user.passport.configure(app);

// set default express behavior
// disable x-powered-by signature
// and enable case-sensitive routing
app.set('env', config.env);
app.set('x-powered-by', false);
app.set('case sensitive routing', true);
app.set('views', path.join(__dirname, 'modules'));
app.set('view engine', 'pug');

// configure middleware
app.use(core.middleware.requestLoggerMiddleware());
app.use(core.middleware.requestUtilsMiddleware());

app.use(flash());
// set locals variables
// to be used in pug
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.user = req.user || undefined;
  res.locals.roleList = user.model.UserRoles;
  // Current user role
  res.locals.userRole = req.session.userRole;
  next();
});

app.use(core.routes);
app.use(user.routes);
app.use(order.routes);
app.use(food.routes);

app.use(core.middleware.errorFlash());

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404);
  res.render('core/views/errors/404');
});

module.exports = http;
