import express from 'express';
import { createProduct, deleteProduct, getProductId, getProducts, updateProduct, addReview } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.post('/', createProduct);
productRouter.get('/:productID', getProductId);
productRouter.put('/:productID', updateProduct);
productRouter.delete('/:productID', deleteProduct);
productRouter.post('/:productID/reviews', addReview);

export default productRouter;