const validate = require('validate.js');
const constraints = require('./validation');
const { Order } = require('../order/model');
const { UserRoles } = require('../user/model');
const { BadRequestError } = require('../../../common/errors');

/**
 * Product validate middleware
 */
const validateCreate = function validateCreate() {
  return async (req, res, next) => {
    try {
      await validate.async(req.body, constraints.createOrder);
      return next();
    } catch (err) {
      return next(new BadRequestError('Validation error', err));
    }
  };
};

const validateGet = function () {
  return async (req, res, next) => {
    const user = req.user;
    if (req.params.id) {
      const orderId = req.params.id;
      const order = await Order.getById(orderId);
      if (!order) {
        return next(new Error('Invalid order.'));
      }
      if (user.role === UserRoles.ROLE_USER && order.get('user_id') !== user.user_id) {
        return next(new Error('Invalid order.'));
      }
    }
    return next();
  };
};

module.exports = { validateCreate, validateGet };

