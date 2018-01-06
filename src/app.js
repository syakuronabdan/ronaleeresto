import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import statusMonitor from 'express-status-monitor';
import responseTime from 'response-time';
import Raven from 'raven';
import config from '../config';
import c from './constants';
import core from './modules/core';
import user from './modules/user';
import product from './modules/product';
import address from './modules/address';
import order from './modules/order';

const app = express();

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection:', err.stack);
});

const sentry = config.sentry.enable;
if (sentry) {
  Raven.config(config.sentry.dsn).install();
}

app.use(statusMonitor());
app.use(responseTime());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(config.publicPath, { maxAge: c.ONE_YEAR }));

app.set('trust proxy', 1);

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

// configure middleware
app.use(core.middleware.requestLoggerMiddleware());
app.use(core.middleware.requestUtilsMiddleware());
app.use(core.middleware.apiResponse());

// should be the first item before registering any routes
// see: https://docs.sentry.io/clients/node/integrations/express/
if (sentry) app.use(Raven.requestHandler());

app.use(core.routes);
app.use(user.routes);
app.use(product.routes);
app.use(address.routes);
app.use(order.routes);

// should be coming first before any other error handler
if (sentry) app.use(Raven.errorHandler());

app.use((req, res, next) => {
  const err = new Error('Path Not Found');
  err.code = 404;
  next(err);
});

app.use(core.middleware.apiErrorResponse());

export default app;
