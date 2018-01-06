import { DataTypes } from 'sequelize';
import core from '../../core';

const sequelize = core.sequelize.db;

export const Food = sequelize.define('food', {
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

export default { Food };
