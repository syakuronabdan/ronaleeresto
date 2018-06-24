const { DataTypes } = require('sequelize');
const core = require('../../core');
const { Food } = require('./food');
const { FoodCategory } = require('./food_category');

const sequelize = core.sequelize.db;

const FCRel = sequelize.define('food_category_rel', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  timestamps: false,
  underscored: true,
});

FCRel.belongsTo(Food, { as: 'food' });
FCRel.belongsTo(FoodCategory, { as: 'fc' });

module.exports = { FCRel };
