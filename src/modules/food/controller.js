const { Product } = require('./model');
const { NotFoundError } = require('../../../common/errors');
const { Food } = require('./model/food');
const { FoodCategory } = require('./model/food_category');
const { error, capitalize } = require('../core/utils');
const { foodMsg } = require('./messages');

const ProductController = {};

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

ProductController.viewAll = async (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const menus = await FoodCategory.getWithPage({}, { page, pageSize });
  return res.render('food/views/viewCategory', {
    ...menus.pagination,
    link: '/admin/categories',
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

ProductController.createView = async (req, res) => {
  res.render('food/views/createCategory', { link: '/admin/categories', type: 'add' });
};

ProductController.create = async (req, res) => {
  const name = capitalize(req.body.name);
  await FoodCategory.create({ name });
  req.flash('success', foodMsg.create_success(name));
  return res.redirect('/admin/categories');
};

ProductController.editView = (link, type) => async (req, res) => {
  const food = await Food.get({ id: req.params.id });
  const fc = await FoodCategory.getAll();
  if (!food) throw error('danger', foodMsg.not_found, { redirect: link });
  return res.render('food/views/createMenu', { link, type, fc, menu: food.serialize() });
};

ProductController.edit = redirect => async (req, res) => {
  const name = capitalize(req.body.name);
  const { price, category } = req.body;
  const update = { name, price, category };
  if (category) update.fc_id = category;
  await Food.update(update, { where: { id: req.params.id } });
  req.flash('success', foodMsg.edit_success);
  return res.redirect(redirect);
};

ProductController.editView = (link, type) => async (req, res) => {
  const category = await FoodCategory.get({ id: req.params.id });
  if (!category) throw error('danger', foodMsg.not_found, { redirect: link });
  return res.render('food/views/createCategory', { link, type, menu: category.serialize() });
};

ProductController.edit = redirect => async (req, res) => {
  const name = capitalize(req.body.name);
  const update = { name };
  await FoodCategory.update(update, { where: { id: req.params.id } });
  req.flash('success', foodMsg.edit_success);
  return res.redirect(redirect);
};


ProductController.delete = async (req, res) => {
  const { id } = req.params;
  await Food.destroy({ where: { id } });
  req.flash('success', foodMsg.delete_success);
  return res.redirect('/admin/menus');
};

ProductController.deleteCategory = async (req, res) => {
  const { id } = req.params;
  await FoodCategory.destroy({ where: { id } });
  req.flash('success', foodMsg.delete_success);
  return res.redirect('/admin/categories');
};

module.exports = { ProductController };
