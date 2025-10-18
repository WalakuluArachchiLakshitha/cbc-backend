import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import Order from '../models/order.js';

const orderRouter = express.Router();

orderRouter.post("/", createOrder)
orderRouter.get("/",getOrders)
orderRouter.put("/status/:orderID",updateOrderStatus)

export default orderRouter;