import { DataTypes } from 'sequelize';
import core from '../../core';
import { Food } from './food';
import { FoodCategory } from './food_category';

const sequelize = core.sequelize.db;

export const FCRel = sequelize.define('food_category_rel', {
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

export default { FCRel };
