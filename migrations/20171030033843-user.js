import user from '../src/modules/user';

const { User } = user.model;

module.exports = {
  up: queryInterface => queryInterface.createTable(User.tableName, User.attributes),
  down: queryInterface => queryInterface.dropTable(User.tableName),
};
