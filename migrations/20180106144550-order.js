import order from '../src/modules/order';

const { Order } = order.model;

module.exports = {
  up: queryInterface => queryInterface.createTable(Order.tableName, Order.attributes),
  down: queryInterface => queryInterface.dropTable(Order.tableName),
};
