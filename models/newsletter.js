import mongoose from "mongoose";

const newsletterSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;
