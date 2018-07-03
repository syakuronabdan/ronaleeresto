const { DataTypes } = require('sequelize');
const core = require('../../core');
const { User } = require('../../user/model');

const OrderStatus = {
  NEW: 0,
  ALL_COOKED: 1,
  PAID: 2,
};

const sequelize = core.sequelize.db;

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  order_number: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
  },
  table_num: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
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

Order.belongsTo(User, { as: 'user' });

Order.getById = id => Order.findOne({ where: { order_id: id } });

Order.getAll = (condition = {}) => Order.findAll({
  where: condition,
  include: [
    { model: User },
  ],
});
// TODO: implement hook to decrease the product quantity on order create
// TODO: implement hook to increase the product quantity on order cancel

// eslint-disable-next-line
Order.prototype.serialize = function () {
  const values = Object.assign({}, this.get());

  return values;
};

Order.prototype.reloadData = async function () {
  return this.reload({
    plain: true,
    include: [
      { model: User },
    ],
  });
};

module.exports = { OrderStatus, Order };
