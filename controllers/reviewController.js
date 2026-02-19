import Review from "../models/review.js";

// Get all reviews
export async function getReviews(req, res) {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
    }
}

// Add a new review
export async function addReview(req, res) {
    try {
        const { name, rating, comment } = req.body;

        const review = new Review({
            name,
            rating: Number(rating),
            comment,
            date: Date.now()
        });

        await review.save();
        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Failed to add review" });
    }
}
