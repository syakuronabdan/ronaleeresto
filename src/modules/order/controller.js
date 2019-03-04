const { Order, OrderDetail } = require('./model');
const { Food, FoodCategory } = require('../food/model');
const { NotFoundError } = require('../../../common/errors');

const OrderController = {};

// Socket io

/**
 * Create order
 */
OrderController.createOrder = async (req, res, next) => {
  const ids = req.body.menu[0].ids;
  const foods = await Promise.all(ids.map(id => Food.getById(id)));

  let total = 0;
  const amounts = req.body.menu[0].amounts;
  const details = foods.map((food, idx) => {
    total += food.price * amounts[idx];
    return {
      quantity: amounts[idx],
      unit_price: food.price,
      food_id: food.id,
    };
  });

  const order = await Order.create({
    order_number: req.body.table,
    table_num: req.body.table,
    comment: req.body.notes.trim(),
    total,
    user_id: req.user.id,
  });

  await OrderDetail.bulkCreate(details.map((detail) => {
    detail.order_id = order.id;
    return detail;
  }));

  req.flash('success', 'Order successfully created!');
  return res.redirect('/orders');
};

/**
 * View user order
 */
OrderController.getOrder = async (req, res, next) => {
  let order;
  if (req.params.id) {
    order = await Order.getById(req.params.id);
    if (!order) {
      const err = new NotFoundError('invalid order');
      return next(err);
    }
  } /* else {
    const condition = {
      order_number: req.query.order_number || '',
      shipping_receipt: req.query.shipping_receipt || '',
      id: user.id,
    };
    order = await Order.getAll(condition);
  }*/
  const [foods, fcs] = await Promise.all([Food.getAll(), FoodCategory.getAll()]);
  const sortedFoods = fcs.map(({ dataValues: fc }) => {
    fc.foods = foods.filter(food => food.fc_id === fc.id).map(({ dataValues }) => dataValues);
    return fc;
  });
  return res.render('order/views/createOrder', { foods: sortedFoods, action: '/orders' });
};

module.exports = { OrderController };
