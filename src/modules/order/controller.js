import { Order, OrderStatus } from './model';
// import productModule from '../product';
// import lineItemModule from '../lineItem';
import { NotFoundError } from '../../../common/errors';

// const { Product } = productModule.model;
// const { LineItem, LineItemType } = lineItemModule.model;

export const OrderController = {};
export default { OrderController };

/**
 * Create order
 */
OrderController.createOrder = async (req, res, next) => {
  const user = req.user;
  let order = await Order.create({
    status: OrderStatus.CART,
    user_id: user.user_id,
  });

  const orderId = order.get('order_id');
  const products = req.body.products;

  await Promise.all(products.map(async (product) => {
    // const { product_id, quantity } = product;
    // const productData = await Product.getById(product_id);
    // await LineItem.create({
    //   name: productData.name,
    //   entity_type: LineItemType.PRODUCT,
    //   entity_id: product_id,
    //   quantity,
    //   amount: productData.price,
    //   total_amount: quantity * productData.price,
    //   order_id: orderId,
    // });
  }));
  order = await order.reloadData();

  return res.API.success('Order', order);
};

/**
 * View user order
 */
OrderController.getOrder = async (req, res, next) => {
  const user = req.user;
  let order;
  if (req.params.id) {
    order = await Order.getById(req.params.id);
  } else {
    const condition = {
      order_number: req.query.order_number || '',
      shipping_receipt: req.query.shipping_receipt || '',
      user_id: user.user_id,
    };
    order = await Order.getAll(condition);
  }

  if (!order) {
    const err = new NotFoundError('invalid order');
    return next(err);
  }
  return res.API.success('Order', order);
};

