const { roleMsg } = require('./messages');

const constraints = {};

/**
 * Login
 */
constraints.login = {
  email: {
    presence: true,
  },
  password: {
    presence: true,
  },
};

// req.body always send strings
const UserRoles = ['1', '2', '3', '4'];
/**
 * Create User
 */
constraints.create = {
  email: {
    presence: true,
    email: true,
  },
  password: {
    presence: true,
  },
  name: {
    presence: true,
  },
  role: {
    presence: true,
    inclusion: {
      within: UserRoles,
      message: roleMsg.not_found,
    },
  },
};

module.exports = { constraints };
