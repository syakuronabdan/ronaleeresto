const utils = require('./utils');
const middleware = require('./middleware');
const controller = require('./controller');
const sequelize = require('./sequelize');
const routes = require('./routes');

module.exports = { utils, controller, middleware, sequelize, routes };
