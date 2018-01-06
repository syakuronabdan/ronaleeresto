import validate from 'validate.js';
import constraints from './validation';
import { Order } from '../order/model';
import { UserRoles } from '../user/model';
import { BadRequestError } from '../../../common/errors';

/**
 * Product validate middleware
 */
export function validateCreate() {
  return async (req, res, next) => {
    try {
      await validate.async(req.body, constraints.createOrder);
      return next();
    } catch (err) {
      return next(new BadRequestError('Validation error', err));
    }
  };
}

export function validateGet() {
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
}
