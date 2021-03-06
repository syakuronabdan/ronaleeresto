const { DataTypes } = require('sequelize');
const core = require('../../core');

const sequelize = core.sequelize.db;

const FoodCategory = sequelize.define('food_category', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  timestamps: true,
  paranoid: true,
});

// implements class level method
// do we need to define the class level method?
/**
 * Get food categories by condition
 * @param {Object} condition
 */
FoodCategory.getAll = (condition = {}) => FoodCategory.findAll({ where: condition });

FoodCategory.get = (condition = {}) => FoodCategory.findOne({ where: condition });

// /**
//  * Update food category
//  * @param {integer} id
//  * @param {Object} data
//  */
// FoodCategory.update = (id, data) => FoodCategory.update(data, { where: { product_id: id } });

/**
 * Get food category by id
 * @param {integer} id
 */
FoodCategory.getById = id => FoodCategory.findOne({ where: { product_id: id } });

FoodCategory.getWithPage = (condition = {}, page = {}) =>
  FoodCategory.findAndCountAll(Object.assign(
  { where: condition },
  page.page
    ? { limit: page.pageSize, offset: (page.page - 1) * page.pageSize }
    : {},
)).then(({ count, rows }) => ({
  pagination: { page: page.page, pageCount: Math.ceil(count / page.pageSize) },
  data: rows.map(row => ({ ...row.serialize() })),
}));

FoodCategory.prototype.serialize = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = { FoodCategory };
