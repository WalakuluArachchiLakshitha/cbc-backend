import express from "express";
import {
  createOrder,
  getOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  confirmPayment,
  generatePayHereHash,
  confirmPaymentDemo,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/demo-pay", confirmPaymentDemo);

orderRouter.post("/hash", generatePayHereHash);

orderRouter.get("/my-orders", getUserOrders);

orderRouter.get("/", getOrders);

orderRouter.post("/", createOrder);

orderRouter.post("/payhere-notify", confirmPayment);

orderRouter.put("/status/:orderID", updateOrderStatus);

orderRouter.delete("/:orderID", deleteOrder);

export default orderRouter;
