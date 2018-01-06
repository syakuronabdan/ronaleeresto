import food from '../src/modules/food';

const { FCRel } = food.model;

module.exports = {
  up: queryInterface => queryInterface.createTable(FCRel.tableName, FCRel.attributes),
  down: queryInterface => queryInterface.dropTable(FCRel.tableName),
};
