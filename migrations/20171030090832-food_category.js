import food from '../src/modules/food';

const { FoodCategory } = food.model;

module.exports = {
  up: queryInterface => queryInterface.createTable(FoodCategory.tableName, FoodCategory.attributes),
  down: queryInterface => queryInterface.dropTable(FoodCategory.tableName),
};
