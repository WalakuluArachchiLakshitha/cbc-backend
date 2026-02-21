import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { isAdmin } from "./userController.js";
import crypto from "crypto";


async function generateOrderID() {
	const lastOrder = await Order.findOne().sort({ date: -1 });
	if (!lastOrder) return "CBC0000001";
	const lastNum = parseInt(lastOrder.orderID.replace("CBC", ""));
	return "CBC" + String(lastNum + 1).padStart(7, "0");
}


export async function createOrder(req, res) {
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ message: "Unauthorized user" });
		}

		
		const { address, phone, customerName, items: itemsInRequest } = req.body;

		if (!address || address.trim() === "") {
			return res.status(400).json({ message: "Shipping address is required" });
		}
		if (!phone || phone.trim() === "") {
			return res.status(400).json({ message: "Phone number is required" });
		}
		if (!itemsInRequest || !Array.isArray(itemsInRequest) || itemsInRequest.length === 0) {
			return res.status(400).json({ message: "Items are required to place an order" });
		}

		const resolvedCustomerName = customerName && customerName.trim() !== ""
			? customerName.trim()
			: user.firstName + " " + user.lastName;

		
		const itemsToAdd = [];
		let total = 0;

		for (let i = 0; i < itemsInRequest.length; i++) {
			const item = itemsInRequest[i];
			const product = await Product.findOne({ productID: item.productID });

			if (!product) {
				return res.status(400).json({
					code: "not_found",
					message: "Product with ID " + item.productID + " not found",
					productID: item.productID,
				});
			}

			if (product.stock < item.quantity) {
				return res.status(400).json({
					code: "stock",
					message: "Insufficient stock for product: " + product.name,
					productID: item.productID,
					availableStock: product.stock,
				});
			}

			itemsToAdd.push({
				productID: product.productID,
				quantity: item.quantity,
				name: product.name,
				price: product.price,
				image: product.image[0],
			});
			total += product.price * item.quantity;
		}

		const newOrderID = await generateOrderID();

	
		const paymentExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

		const newOrder = new Order({
			orderID: newOrderID,
			items: itemsToAdd,
			customerName: resolvedCustomerName,
			email: user.email,
			phone: phone.trim(),
			address: address.trim(),
			total,
			status: "pending",
			paymentStatus: "pending",
			paymentExpiresAt,
		});

		const savedOrder = await newOrder.save();

		
		for (let i = 0; i < itemsToAdd.length; i++) {
			const item = itemsToAdd[i];
			await Product.updateOne(
				{ productID: item.productID },
				{ $inc: { stock: -item.quantity } }
			);
		}

		res.status(201).json({
			message: "Order created successfully",
			order: savedOrder,
		});
	} catch (err) {
		console.error("createOrder error:", err);
		res.status(500).json({ message: "Internal server error", error: err.message });
	}
}

export async function getOrders(req, res) {
	try {
		if (isAdmin(req)) {
			const orders = await Order.find().sort({ date: -1 });
			return res.json(orders);
		}
		if (req.user) {
			const orders = await Order.find({ email: req.user.email }).sort({ date: -1 });
			return res.json(orders);
		}
		return res.status(403).json({ message: "You are not authorized to view orders" });
	} catch (err) {
		console.error("getOrders error:", err);
		res.status(500).json({ message: "Failed to fetch orders" });
	}
}


export async function getUserOrders(req, res) {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const orders = await Order.find({ email: req.user.email }).sort({ date: -1 });
		res.json(orders);
	} catch (err) {
		console.error("getUserOrders error:", err);
		res.status(500).json({ message: "Failed to fetch your orders" });
	}
}


export async function updateOrderStatus(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "You are not authorized to update order status" });
	}
	const orderID = req.params.orderID;
	const newStatus = req.body.status;
	try {
		await Order.updateOne({ orderID }, { status: newStatus });
		res.json({ message: "Order status updated successfully" });
	} catch (err) {
		console.error("updateOrderStatus error:", err);
		res.status(500).json({ message: "Failed to update order status" });
	}
}


export async function deleteOrder(req, res) {
	if (!isAdmin(req)) {
		return res.status(403).json({ message: "You are not authorized to delete orders" });
	}
	const orderID = req.params.orderID;
	try {
		const result = await Order.deleteOne({ orderID });
		if (result.deletedCount === 0) {
			return res.status(404).json({ message: "Order not found" });
		}
		res.json({ message: "Order deleted successfully" });
	} catch (err) {
		console.error("deleteOrder error:", err);
		res.status(500).json({ message: "Failed to delete order" });
	}
}


export async function cancelExpiredOrders() {
	try {
		const now = new Date();
		const expiredOrders = await Order.find({
			status: "pending",
			paymentStatus: "pending",
			paymentExpiresAt: { $lt: now, $ne: null },
		});

		if (expiredOrders.length === 0) return;

		console.log(`[Orders] Cancelling ${expiredOrders.length} expired order(s)...`);

		for (const order of expiredOrders) {
			
			for (const item of order.items) {
				await Product.updateOne(
					{ productID: item.productID },
					{ $inc: { stock: item.quantity } }
				);
			}
		
			await Order.updateOne(
				{ orderID: order.orderID },
				{ status: "cancelled", paymentStatus: "cancelled" }
			);
			console.log(`[Orders] Cancelled order ${order.orderID} — stock restored`);
		}
	} catch (err) {
		console.error("[Orders] cancelExpiredOrders error:", err);
	}
}


export async function confirmPayment(req, res) {
	try {
		const {
			merchant_id,
			order_id,
			payment_id,
			payhere_amount,
			payhere_currency,
			status_code,
			md5sig,
		} = req.body;

		const merchantSecret = process.env.PAYHERE_SECRET || "";

		
		const localMd5 = crypto
			.createHash("md5")
			.update(merchantSecret)
			.digest("hex")
			.toUpperCase();

		const expectedSig = crypto
			.createHash("md5")
			.update(
				merchant_id +
				order_id +
				payhere_amount +
				payhere_currency +
				status_code +
				localMd5
			)
			.digest("hex")
			.toUpperCase();

		if (md5sig !== expectedSig) {
			console.warn("[PayHere] Invalid signature for order:", order_id);
			return res.status(400).send("Invalid signature");
		}

		if (status_code === "2") {
		
			await Order.updateOne(
				{ orderID: order_id },
				{ status: "processing", paymentStatus: "paid" }
			);
			console.log(`[PayHere] Payment confirmed for order ${order_id}`);
		} else if (status_code === "0") {
			
			console.log(`[PayHere] Payment pending for order ${order_id}`);
		} else {
			
			await Order.updateOne(
				{ orderID: order_id },
				{ paymentStatus: "failed" }
			);
			
			const order = await Order.findOne({ orderID: order_id });
			if (order) {
				for (const item of order.items) {
					await Product.updateOne(
						{ productID: item.productID },
						{ $inc: { stock: item.quantity } }
					);
				}
				await Order.updateOne({ orderID: order_id }, { status: "cancelled" });
			}
			console.log(`[PayHere] Payment failed/cancelled for order ${order_id}`);
		}

		res.send("OK");
	} catch (err) {
		console.error("[PayHere] confirmPayment error:", err);
		res.status(500).send("Error");
	}
}


export async function generatePayHereHash(req, res) {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { orderID, amount, currency = "LKR" } = req.body;

		if (!orderID || !amount) {
			return res.status(400).json({ message: "orderID and amount are required" });
		}

	
		const order = await Order.findOne({ orderID, email: req.user.email });
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		const merchantId = process.env.PAYHERE_MERCHANT_ID;
		const merchantSecret = process.env.PAYHERE_SECRET;

		if (!merchantId || !merchantSecret) {
			return res.status(500).json({ message: "PayHere not configured on server" });
		}

	
		const hashedSecret = crypto
			.createHash("md5")
			.update(merchantSecret)
			.digest("hex")
			.toUpperCase();

		
		const formattedAmount = parseFloat(amount).toFixed(2);

	
		const hash = crypto
			.createHash("md5")
			.update(merchantId + orderID + formattedAmount + currency + hashedSecret)
			.digest("hex")
			.toUpperCase();

		res.json({ hash, merchantId, formattedAmount, currency });
	} catch (err) {
		console.error("[PayHere] generatePayHereHash error:", err);
		res.status(500).json({ message: "Failed to generate payment hash" });
	}
}


export async function confirmPaymentDemo(req, res) {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const { orderID } = req.body;
		if (!orderID) {
			return res.status(400).json({ message: "orderID is required" });
		}
		
		const order = await Order.findOne({ orderID, email: req.user.email });
		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}
		if (order.paymentStatus === "paid") {
			return res.json({ message: "Already paid", order });
		}
		if (order.status === "cancelled") {
			return res.status(400).json({ message: "Order has expired and been cancelled" });
		}
		
		await Order.updateOne(
			{ orderID },
			{ status: "processing", paymentStatus: "paid" }
		);
		const updated = await Order.findOne({ orderID });
		console.log(`[Demo] Payment simulated for order ${orderID}`);
		res.json({ message: "Payment confirmed (demo)", order: updated });
	} catch (err) {
		console.error("[Demo] confirmPaymentDemo error:", err);
		res.status(500).json({ message: "Failed to confirm demo payment" });
	}
}
