import express from 'express';
import { ReviewController } from "./review.controller";
import authenticate from "../../middlewares/authenticate";

const router = express.Router();

router.post('/create', authenticate, ReviewController.createReview);  // Add review
router.get('/all', ReviewController.getAllReviewsFromDb);
router.get('/:productId', ReviewController.getReviewsByProductId);  // Get reviews by product ID
router.post('/like/:reviewId', authenticate, ReviewController.likeReview);  // Like a review
router.post('/reply/:reviewId', authenticate, ReviewController.replyToReview);  // Reply to review
router.put('/edit/:reviewId', authenticate, ReviewController.editReview);  // Edit a review
router.delete('/delete/:reviewId', authenticate, ReviewController.deleteReview);  // Delete a review
// router.put('/edit-reply/:reviewId/:replyId', authenticate, ReviewController.editReply);  // Edit a reply
router.delete('/delete-reply/:reviewId/:replyId', authenticate, ReviewController.deleteReply);  // Delete a reply

export const ReviewRoutes = router;
