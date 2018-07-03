const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const core = require('../../core');

const { capitalize } = core.utils;
const sequelize = core.sequelize.db;

// used by bcrypt to generate new salt
// 8 rounds will produce about 40 hashes per second on a 2GHz core
// see: https://www.npmjs.com/package/bcrypt
const SALT_ROUND = 8;

const UserRoles = {
  ADMIN: 1,
  WAITER: 2,
  COOK: 3,
  CASHIER: 4,
};

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    values: [1, 2, 3, 4],
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  last_log: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP()'),
  },
}, {
  timestamps: true,
  underscored: true,
  paranoid: true,
});

/**
 * Create password hash from plain text synchronously
 * @param {string} str
 */
User.hashPassword = async str => await bcrypt.hash(str, SALT_ROUND);
User.hashPasswordSync = str => bcrypt.hashSync(str, SALT_ROUND);

/**
 * Get a user by id
 * @param {integer} id
 */
User.getById = id => User.findOne({ where: { user_id: id } });

/**
 * Get a user by condition
 * @param {object} condition
 */
User.get = (condition = {}) => User.findOne({ where: condition });

/**
 * Get users by condition
 * @param {Object} condition
 */
User.getAll = (condition = {}) => User.findAll({ where: condition });

/**
 * Get users for views with pagination
 *
 * @param {Object} condition
 * @param {{ page, pageSize }} page
 */
User.getWithPage = (condition = {}, page = {}) => User.findAndCountAll(Object.assign(
  { where: condition },
  page.page
    ? { limit: page.pageSize, offset: (page.page - 1) * page.pageSize }
    : {},
)).then(({ count, rows }) => {
  const roles = Object.keys(UserRoles).reduce((res, role) => {
    const id = UserRoles[role];
    res[id] = { id, name: capitalize(role) };
    return res;
  }, {});
  return {
    pagination: { page: page.page, pageCount: Math.ceil(count / page.pageSize) },
    data: rows.map(row => ({ ...row.serialize(), role: roles[row.role] })),
  };
});

/**
 * Compare plain password with it's hashed password
 * @param {string} plain
 * @return {bool}
 */
// eslint-disable-next-line
User.prototype.checkPassword = function (plain) {
  return bcrypt.compareSync(plain, this.get('password'));
};

// eslint-disable-next-line
User.prototype.serialize = function () {
  const values = Object.assign({}, this.get());

  delete values.password;
  return values;
};

module.exports = { UserRoles, User };
