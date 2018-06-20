import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import flash from 'connect-flash';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import statusMonitor from 'express-status-monitor';
import responseTime from 'response-time';
import config from '../config';
import c from './constants';
import core from './modules/core';
import user from './modules/user';
import order from './modules/order';

const app = express();

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection:', err.stack);
});

app.use(statusMonitor());
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

app.use(core.routes);
app.use(user.routes);
app.use(order.routes);

app.use(core.middleware.errorFlash());

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404);
  res.render('core/views/errors/404');
});

export default app;
