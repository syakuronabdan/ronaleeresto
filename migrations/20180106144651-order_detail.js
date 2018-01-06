import order from '../src/modules/order';

const { OrderDetail } = order.model;

module.exports = {
  up: queryInterface => queryInterface.createTable(OrderDetail.tableName, OrderDetail.attributes),
  down: queryInterface => queryInterface.dropTable(OrderDetail.tableName),
};
