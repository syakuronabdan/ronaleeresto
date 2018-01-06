import { Sequelize } from 'sequelize';
import cfg from '../../../config';

/**
 * Connect to mysql instance
 * @param {string} config
 * @return {Promise}
 * TODO: add log file for debugging
 */
function connect(config) {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.debug,
  });
  return sequelize;
}

const db = connect(cfg.sequelize);

export default { db };
