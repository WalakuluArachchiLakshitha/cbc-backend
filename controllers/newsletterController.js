import Newsletter from "../models/newsletter.js";

export async function subscribe(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const existingSubscriber = await Newsletter.findOne({ email });

        if (existingSubscriber) {
            return res.status(400).json({ message: "Email already subscribed" });
        }

        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
