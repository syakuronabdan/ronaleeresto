import { Product } from './model';
import { NotFoundError } from '../../../common/errors';

export const ProductController = {};
export default { ProductController };

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
