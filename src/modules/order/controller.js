const { Order, OrderDetail, OrderStatus, OrderDetailStatus } = require('./model');
const { Food, FoodCategory } = require('../food/model');
const { NotFoundError } = require('../../../common/errors');

const OrderController = {};

// Socket io

/**
 * Create order
 */
OrderController.createOrder = async (req, res, next) => {
  let ids = req.body.menu[0].ids;
  if (!Array.isArray(ids)) ids = [ids];
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

  req.app.io.emit('newOrder', { orderId: order.id });

  req.flash('success', 'Order successfully created!');
  return res.redirect('/orders');
};

/**
 * View user order
 */
OrderController.getOrder = async (req, res, next) => {
  const [foods, fcs] = await Promise.all([Food.getAll(), FoodCategory.getAll()]);
  const sortedFoods = fcs.map(({ dataValues: fc }) => {
    fc.foods = foods.filter(food => food.fc_id === fc.id).map(({ dataValues }) => dataValues);
    return fc;
  });
  return res.render('order/views/createOrder', { foods: sortedFoods, action: '/orders' });
};

OrderController.cookOrder = async (req, res, next) => {
  const orders = await Order.findAll({
    where: { state: OrderStatus.NEW },
    include: [
      { model: OrderDetail,
        as: 'orderDetail',
        include: [
          { model: Food, as: 'food' },
        ],
      },
    ],
  });

  return res.render('order/views/cookOrder', { orders });
};

OrderController.orderDone = async (req, res, next) => {
  const { id } = req.params;
  await Promise.all([
    Order.update({ state: OrderStatus.ALL_COOKED }, { where: { id } }),
    OrderDetail.update({ state: OrderDetailStatus.COOKED }, { where: { order_id: id } }),
  ]).catch(() => Promise.reject({ type: 'json' }));

  req.app.io.emit('cookedOrder', { orderId: id });

  return res.json({});
};

OrderController.payOrder = async (req, res, next) => {
  const orders = await Order.findAll({
    where: { state: OrderStatus.ALL_COOKED },
    include: [
      { model: OrderDetail,
        as: 'orderDetail',
        include: [
          { model: Food, as: 'food' },
        ],
      },
    ],
  });

  return res.render('order/views/payOrder', { orders });
};

OrderController.orderPaid = async (req, res) => {
  const { id } = req.params;
  await Order.update({ state: OrderStatus.PAID }, { where: { id } })
    .catch(() => Promise.reject({ type: 'json' }));
  return res.send();
};

OrderController.getCookOrdersFrom = async (req, res, next) => {
  const { id } = req.params;

  const orders = await Order.findAll({
    where: { id: { $gt: id }, $and: { state: OrderStatus.NEW } },
    include: [
      { model: OrderDetail,
        as: 'orderDetail',
        include: [
          { model: Food, as: 'food' },
        ],
      },
    ],
  });

  return res.json(orders);
};

OrderController.getPayOrdersFrom = async (req, res, next) => {
  const { id } = req.params;
  const shownOrder = await Order.findOne({ where: { id }, raw: true });

  const orders = await Order.findAll({
    where: { updated_at: { $gt: shownOrder.updated_at }, $and: { state: OrderStatus.ALL_COOKED } },
    include: [
      { model: OrderDetail,
        as: 'orderDetail',
        include: [
          { model: Food, as: 'food' },
        ],
      },
    ],
  });

  return res.json(orders);
};

module.exports = { OrderController };
