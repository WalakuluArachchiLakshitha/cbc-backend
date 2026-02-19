import express from "express";
import mongoose from "mongoose";
import orderRouter from "./routes/orderRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";
import cors from "cors"
import dotenv from "dotenv"
import { subscribe } from "./controllers/newsletterController.js"
import reviewRouter from "./routes/reviewRouter.js"
import { cancelExpiredOrders } from "./controllers/orderController.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// JWT middleware
app.use(
    (req, res, next) => {
        let token = req.header("Authorization")
        if (token != null) {
            token = token.replace("Bearer ", "")
            jwt.verify(token, process.env.JWT_SECRET,
                (err, decoded) => {
                    if (err || decoded == null) {
                        console.log("Invalid token login again");
                        return res.json({ message: "Invalid token login again" })
                    } else {
                        req.user = decoded
                        next()
                    }
                }
            )
        } else {
            next()
        }
    }
)

const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    () => {
        console.log("Database connected successfully")

        // Run expired-order cancellation immediately on startup, then every 60 seconds
        cancelExpiredOrders();
        setInterval(cancelExpiredOrders, 60 * 1000);
        console.log("[Orders] Auto-cancellation scheduler started (every 60s)")
    }
).catch(
    () => {
        console.log("Database connection failed")
    }
)

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)
app.post("/api/newsletter", subscribe);
app.use("/api/reviews", reviewRouter);

app.listen(8000,
    () => {
        console.log("Server is running on port 8000")
    }
)