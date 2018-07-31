const { DataTypes } = require('sequelize');
const core = require('../../core');
const { FoodCategory } = require('./food_category');

const sequelize = core.sequelize.db;

const Food = sequelize.define('food', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
  },
  fc_id: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
}, {
  underscored: true,
  timestamps: true,
  paranoid: true,
});

// implements class level method
// do we need to define the class level method?
/**
 * Get foods by condition
 * @param {Object} condition
 */
Food.getAll = (condition = {}) => Food.findAll({ where: condition });

// /**
//  * Update food
//  * @param {integer} id
//  * @param {Object} data
//  */
// Food.update = (id, data) => Food.update(data, { where: { product_id: id } });

/**
 * Get food by id
 * @param {integer} id
 */
Food.getById = id => Food.findOne({ where: { product_id: id } });

Food.belongsTo(FoodCategory, { as: 'fc' });

Food.getWithPage = (condition = {}, page = {}) => Food.findAndCountAll(Object.assign(
  { include: [{ model: FoodCategory, as: 'fc' }], where: condition},
  page.page
    ? { limit: page.pageSize, offset: (page.page - 1) * page.pageSize }
    : {},
)).then(({ count, rows }) => ({
  pagination: { page: page.page, pageCount: Math.ceil(count / page.pageSize) },
  data: rows.map(row => ({ ...row.serialize() })),
}));

Food.prototype.serialize = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = { Food };
