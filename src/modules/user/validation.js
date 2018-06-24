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

module.exports = { constraints };
