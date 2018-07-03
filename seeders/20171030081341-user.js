import user from '../src/modules/user';

const { User, UserRoles } = user.model;

module.exports = {
  up: queryInterface => queryInterface.bulkInsert('users', [{
    id: 1,
    name: 'admin',
    email: 'admin@ronaleeresto.com',
    password: User.hashPasswordSync('admin'),
    created_at: new Date(),
    updated_at: new Date(),
    role: UserRoles.ADMIN,
  }, {
    id: 2,
    name: 'waiter',
    email: 'waiter@ronaleeresto.com',
    password: User.hashPasswordSync('test123'),
    created_at: new Date(),
    updated_at: new Date(),
    role: UserRoles.WAITER,
  }, {
    id: 3,
    name: 'cook',
    email: 'cook@ronaleeresto.com',
    password: User.hashPasswordSync('test123'),
    created_at: new Date(),
    updated_at: new Date(),
    role: UserRoles.COOK,
  }, {
    id: 4,
    name: 'cashier',
    email: 'cashier@ronaleeresto.com',
    password: User.hashPasswordSync('test123'),
    created_at: new Date(),
    updated_at: new Date(),
    role: UserRoles.CASHIER,
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
