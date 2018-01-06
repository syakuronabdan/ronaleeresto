import food from '../src/modules/food';

const { Food } = food.model;

module.exports = {
  up: queryInterface => queryInterface.createTable(Food.tableName, Food.attributes),
  down: queryInterface => queryInterface.dropTable(Food.tableName),
};
