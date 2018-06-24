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
  parent: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
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

module.exports = { FoodCategory };
