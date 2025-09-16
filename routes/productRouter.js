import express from 'express';
import { createProduct, deleteProduct, getProductId, getProducts, updateProduct } from '../controllers/productController.js';
import e from 'express';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.post('/', createProduct);
productRouter.get('/:productID', getProductId);
productRouter.put('/:productID', updateProduct);
productRouter.delete('/:productID', deleteProduct);

export default productRouter;