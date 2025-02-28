import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';
import Product from '../product/product.model';
import Review from './review.model';

const createReview = catchAsync(async (req: Request, res: Response) => {
	const { productId, rating, comment } = req.body;
	const userId = req.user._id; // Assuming `req.user` is populated by authentication middleware

	// Create a new review document
	const newReview = new Review({
		productId,
		userId,
		rating,
		comment,
		likes: [],
		replies: [],
	});

	// Save the review to the database
	await newReview.save();

	// Link the review to the product (if needed)
	const product = await Product.findById(productId);
	if (product) {
		product.reviews.push(newReview._id); // Add the review's _id to the product's reviews array
		await product.save();
	}

	// Send the response with the new review
	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Review added successfully',
		data: newReview,
	});
});

// Get reviews by product ID
const getReviewsByProductId = catchAsync(async (req: Request, res: Response) => {
	const { productId } = req.params;

	// Call service to get reviews
	const reviews = await ReviewService.getReviewsByProductId(productId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reviews retrieved successfully',
		data: reviews,
	});
});

// Like a review
const likeReview = catchAsync(async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const userId = req.user._id;

	// Call service to like the review
	const updatedReview = await ReviewService.likeReview(reviewId, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Review liked successfully',
		data: updatedReview,
	});
});

// Reply to a review
const replyToReview = catchAsync(async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const userId = req.user._id;
	const { reply, userName } = req.body; // Get the user's name from the request body

	// Call service to add a reply
	const updatedReview = await ReviewService.replyToReview(reviewId, userId, reply, userName);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reply added successfully',
		data: updatedReview,
	});
});

// Edit a review
const editReview = catchAsync(async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const userId = req.user._id;
	const { updatedComment } = req.body;

	// Call service to edit the review
	const updatedReview = await ReviewService.editReview(reviewId, userId, updatedComment);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Review updated successfully',
		data: updatedReview,
	});
});

// Delete a review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const userId = req.user._id;

	// Call service to delete the review
	const deletedReview = await ReviewService.deleteReview(reviewId, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Review deleted successfully',
		data: deletedReview,
	});
});

// Edit a reply
const editReply = catchAsync(async (req: Request, res: Response) => {
	const { reviewId, replyId } = req.params;
	const userId = req.user._id;
	const { updatedComment } = req.body;

	console.log('Received reviewId:', reviewId);
	console.log('Received replyId:', replyId);
	console.log('User ID from token:', userId);
	console.log('Updated comment from request body:', updatedComment);

	// Ensure updatedComment exists in the request body
	if (!updatedComment) {
		throw new Error("Updated comment is required");
	}

	// Call the service to edit the reply
	const updatedReview = await ReviewService.editReply(reviewId, replyId, userId, updatedComment);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reply updated successfully',
		data: updatedReview,
	});
});


// Delete a reply
const deleteReply = catchAsync(async (req: Request, res: Response) => {
	const { reviewId, replyId } = req.params;
	const userId = req.user?._id;


	if (!userId) {
		throw new Error("User ID not found in request");
	}

	// Call the service to delete the reply
	const updatedReview = await ReviewService.deleteReply(reviewId, replyId, userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reply deleted successfully',
		data: updatedReview,
	});
});


export const ReviewController = {
	createReview,
	getReviewsByProductId,
	likeReview,
	replyToReview,
	editReview,
	deleteReview,
	editReply,
	deleteReply
};
