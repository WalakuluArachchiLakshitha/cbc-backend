import express from 'express';
import { getReviews, addReview } from '../controllers/reviewController.js';

const reviewRouter = express.Router();

reviewRouter.get('/', getReviews);
reviewRouter.post('/', addReview);

export default reviewRouter;
