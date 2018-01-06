import user from '../src/modules/user';

const { User, UserRoles } = user.model;

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('users', [{
    user_id: 1,
    name: 'admin',
    email: 'admin@ronaleeresto.com',
    password: User.hashPasswordSync('admin'),
    role: UserRoles.ADMIN,
  }, {
    user_id: 2,
    name: 'waiter',
    email: 'waiter@ronaleeresto.com',
    password: User.hashPasswordSync('test123'),
    role: UserRoles.WAITER,
  }, {
    user_id: 3,
    name: 'cook',
    email: 'cook@ronaleeresto.com',
    password: User.hashPasswordSync('test123'),
    role: UserRoles.COOK,
  }, {
    user_id: 4,
    name: 'cashier',
    email: 'cashier@ronaleeresto.com',
    password: User.hashPasswordSync('test123'),
    role: UserRoles.CASHIER,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
