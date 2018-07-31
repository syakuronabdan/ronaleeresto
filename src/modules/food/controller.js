const { Product } = require('./model');
const { NotFoundError } = require('../../../common/errors');
const { Food } = require('./model/food');
const { FoodCategory } = require('./model/food_category');
const { error, capitalize } = require('../core/utils');
const { foodMsg } = require('./messages');


const ProductController = {};

/**
 * Get Product
 */
ProductController.getProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.getById(id);

  if (!product) {
    const err = new NotFoundError('Product not found');
    res.API.error(err);
  }
  return res.API.success('Product data', product);
};

/**
 * Get Product
 */
ProductController.getAllProduct = async (req, res) => {
  const products = await Product.getAll({ status: 'active' });

  return res.API.success('Product data', products);
};

ProductController.viewAll = async (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const menus = await Food.getWithPage({}, { page, pageSize });
  return res.render('food/views/viewMenu', {
    ...menus.pagination,
    link: '/admin/menus',
    menus: menus.data,
  });
};

ProductController.createView = async (req, res) => {
  const fc = await FoodCategory.getAll();
  res.render('food/views/createMenu', { link: '/admin/menus', type: 'add', fc });
};

ProductController.create = async (req, res) => {
  const name = capitalize(req.body.name);
  const price = req.body.price;
  const category = req.body.category;
  await Food.create({ name, price, fc_id: category });
  req.flash('success', foodMsg.create_success(name));
  return res.redirect('/admin/menus');
};

module.exports = { ProductController };

