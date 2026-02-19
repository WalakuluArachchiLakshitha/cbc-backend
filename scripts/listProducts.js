import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";

dotenv.config();

async function listProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for auditing");

        const products = await Product.find({}, "productID name category");

        // Sort and collect categories
        const categories = new Set();
        products.forEach(p => {
            if (p.category) categories.add(p.category);
        });

        console.log("\n--- Unique Categories ---");
        console.log([...categories].sort());

        console.log("\n--- Sample Product Categories ---");
        products.slice(0, 10).forEach(p => {
            console.log(`${p.productID}: "${p.category}"`);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error("Error listing products:", error);
        mongoose.disconnect();
    }
}

listProducts();
