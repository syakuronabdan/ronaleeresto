const { DataTypes } = require('sequelize');
const core = require('../../core');
const { Order } = require('./order');
const { Food } = require('../../food/model');

const OrderDetailStatus = {
  NEW: 0,
  COOKED: 1,
};

const sequelize = core.sequelize.db;

const OrderDetail = sequelize.define('order_detail', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(6, 0),
    allowNull: false,
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  disc_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Number of items cooked
  cooked: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  state: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
  paranoid: true,
});

OrderDetail.belongsTo(Order, { as: 'order' });
OrderDetail.belongsTo(Food, { as: 'food' });

OrderDetail.getById = id => OrderDetail.findOne({ where: { order_id: id } });

OrderDetail.getAll = (condition = {}) => OrderDetail.findAll({
  where: condition,
  include: [
    { model: Order },
    { model: Food },
  ],
});
// TODO: implement hook to decrease the product quantity on order create
// TODO: implement hook to increase the product quantity on order cancel

// eslint-disable-next-line
OrderDetail.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  return values;
};

OrderDetail.prototype.reloadData = async function () {
  return this.reload({
    plain: true,
    include: [
      { model: Order },
      { model: Food },
    ],
  });
};

module.exports = { OrderDetailStatus, OrderDetail };
