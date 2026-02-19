import express from 'express';
import {
    createOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus,
    deleteOrder,
    confirmPayment,
    generatePayHereHash,
    confirmPaymentDemo
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Demo: simulate payment success (no real PayHere account needed)
orderRouter.post("/demo-pay", confirmPaymentDemo)

// Generate PayHere hash (for real PayHere in production)
orderRouter.post("/hash", generatePayHereHash)

// User: get own orders
orderRouter.get("/my-orders", getUserOrders)

// Admin / user: get all orders
orderRouter.get("/", getOrders)

// Place a new order
orderRouter.post("/", createOrder)

// PayHere payment notification (no auth — called by PayHere server)
orderRouter.post("/payhere-notify", confirmPayment)

// Admin: update order status
orderRouter.put("/status/:orderID", updateOrderStatus)

// Admin: delete order
orderRouter.delete("/:orderID", deleteOrder)

export default orderRouter;