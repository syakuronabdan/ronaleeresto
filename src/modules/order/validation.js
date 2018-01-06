import validate from 'validate.js';
// import productModule from '../product';

const constraints = {};
// const { Product, ProductStatus } = productModule.model;

validate.validators.validateProduct = async (products) => {
  // if (!products.length) return Promise.resolve('Products is empty');
  // return await Promise.all(products.map(async (product) => {
  //   const { quantity } = product;
  //   const productId = product.product_id;
  //   const productData = await Product.findById(productId);
  //   if (!productData) {
  //     throw new Error(`^Product id ${productId} not found`);
  //   }
  //   const newQuantity = productData.quantity - quantity;
  //   if (newQuantity < 0) throw new Error(`^Product ${productData.name} quantity is not enough`);
  //   if (productData.status !== ProductStatus.ACTIVE) throw new Error(`^Product ${productData.name} quantity is not available`);
  // }))
  //   .then(() => Promise.resolve())
  //   .catch(err => Promise.resolve(err.message));
};

/**
 * Create order
 */
constraints.createOrder = {
  products: {
    presence: true,
    validateProduct: true,
  },
};

export default constraints;
