import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";

dotenv.config();

const productImages = {
    // Haircare
    "HC-001": ["https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=1000&auto=format&fit=crop"], // Shampoo
    "HC-002": ["https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?q=80&w=1000&auto=format&fit=crop"], // Conditioner
    "HC-003": ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"], // Serum

    // Skincare
    "SC-001": ["https://images.unsplash.com/photo-1556228720-1957be83f360?q=80&w=1000&auto=format&fit=crop"], // Face Wash
    "SC-002": ["https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=1000&auto=format&fit=crop"], // Moisturizer
    "SC-003": ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000&auto=format&fit=crop"], // Sunscreen

    // Watches
    "WT-001": ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop"], // Digital Watch
    "WT-002": ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop"], // Analog Watch
    "WT-003": ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop"], // Smart Watch

    // Jewellery
    "JW-001": ["https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1000&auto=format&fit=crop"], // Necklace
    "JW-002": ["https://images.unsplash.com/photo-1605100804763-ebea240d85a1?q=80&w=1000&auto=format&fit=crop"], // Ring
    "JW-003": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop"], // Bracelet

    // Perfumes
    "PF-001": ["https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop"], // Perfume
    "PF-002": ["https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop"], // Body Spray
    "PF-003": ["https://images.unsplash.com/photo-1628088306391-1631cdd36e7c?q=80&w=1000&auto=format&fit=crop"], // Deodorant

    // Looksmaxxing
    "LM-001": ["https://images.unsplash.com/photo-1621535450849-2e65c0834316?q=80&w=1000&auto=format&fit=crop"], // Beard Oil
    "LM-002": ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop"], // Roller
    "LM-003": ["https://images.unsplash.com/photo-1559599101-f09722fb2945?q=80&w=1000&auto=format&fit=crop"], // Whitening Kit

    // Accessories
    "AC-001": ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop"], // Sunglasses
    "AC-002": ["https://images.unsplash.com/photo-1627123424574-183ce30218e5?q=80&w=1000&auto=format&fit=crop"], // Wallet
    "AC-003": ["https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop"], // Belt

    // Bundle Deals
    "BD-001": ["https://images.unsplash.com/photo-1556228720-1957be83f360?q=80&w=1000&auto=format&fit=crop"], // Skincare Combo
    "BD-002": ["https://images.unsplash.com/photo-1585232569528-70986cf32fb7?q=80&w=1000&auto=format&fit=crop"], // Haircare Pack
    "BD-003": ["https://images.unsplash.com/photo-1590611936760-eeb9f53d226b?q=80&w=1000&auto=format&fit=crop"]  // Perfume Set
};

async function updateProductImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for updating images");

        for (const [productId, images] of Object.entries(productImages)) {
            const result = await Product.updateOne(
                { productID: productId },
                { $set: { image: images } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated images for ${productId}`);
            } else {
                console.log(`Product ${productId} not found`);
            }
        }

        console.log("All product images updated successfully");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error updating product images:", error);
        mongoose.disconnect();
    }
}

updateProductImages();
