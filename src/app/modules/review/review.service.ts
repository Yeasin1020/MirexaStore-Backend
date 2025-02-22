import { Types } from 'mongoose';
import Review from './review.model';
import Product from '../product/product.model';
import { TReview } from './review.interface';


const createReview = async (reviewData: TReview) => {
	const newReview = new Review(reviewData);
	await newReview.save();

	// Link the review to the product
	const product = await Product.findById(reviewData.productId);
	if (product) {
		// Ensure the product's reviews array is updated with an ObjectId
		product.reviews.push(newReview._id); // _id is already an ObjectId, no need for further conversion
		await product.save();
	}

	return newReview;
};



// Get reviews by product ID
const getReviewsByProductId = async (productId: string) => {
	if (!Types.ObjectId.isValid(productId)) {
		throw new Error("Invalid product ID");
	}

	// Use ObjectId directly, Mongoose handles the conversion internally
	const productObjectId = new Types.ObjectId(productId);

	return await Review.find({ productId: productObjectId }).populate('userId', 'name');
};

// Like or unlike a review
const likeReview = async (reviewId: string, userId: string) => {
	if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(userId)) {
		throw new Error("Invalid review or user ID");
	}

	const reviewObjectId = new Types.ObjectId(reviewId);
	const userObjectId = new Types.ObjectId(userId);

	const review = await Review.findById(reviewObjectId);

	if (!review) {
		throw new Error("Review not found");
	}

	// Check if the user has already liked the review
	const alreadyLiked = review.likes.includes(userObjectId);

	if (alreadyLiked) {
		// User has already liked, so we remove the like
		review.likes = review.likes.filter((like) => like.toString() !== userObjectId.toString());
	} else {
		// User has not liked yet, so we add the like
		review.likes.push(userObjectId);
	}

	await review.save();
	return review; // Return the updated review
};

// Add a reply to a review
const replyToReview = async (reviewId: string, userId: string, reply: string, userName: string) => {
	if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(userId)) {
		throw new Error("Invalid review or user ID");
	}

	const reviewObjectId = new Types.ObjectId(reviewId);
	const userObjectId = new Types.ObjectId(userId);

	const review = await Review.findById(reviewObjectId);

	if (!review) {
		throw new Error("Review not found");
	}

	// Mongoose will automatically generate the _id for the new reply
	review.replies.push({
		userId: userObjectId,
		userName,
		comment: reply,
		timestamp: new Date(),
	});

	await review.save();

	return review;
};

// Edit a review
const editReview = async (reviewId: string, userId: string, updatedComment: string) => {
	if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(userId)) {
		throw new Error("Invalid review or user ID");
	}

	const reviewObjectId = new Types.ObjectId(reviewId);

	const review = await Review.findById(reviewObjectId);

	if (!review) {
		throw new Error("Review not found");
	}

	if (review.userId.toString() !== userId) {
		throw new Error("You are not authorized to edit this review");
	}

	review.comment = updatedComment;
	await review.save();

	return review;
};

// Delete a review
const deleteReview = async (reviewId: string, userId: string) => {
	if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(userId)) {
		throw new Error("Invalid review or user ID");
	}

	const reviewObjectId = new Types.ObjectId(reviewId);

	const review = await Review.findById(reviewObjectId);

	if (!review) {
		throw new Error("Review not found");
	}

	if (review.userId.toString() !== userId) {
		throw new Error("You are not authorized to delete this review");
	}

	await Review.findByIdAndDelete(reviewObjectId);
	return review;
};

// Edit a reply
const editReply = async (reviewId: string, replyId: string, userId: string, updatedComment: string) => {
	if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(replyId) || !Types.ObjectId.isValid(userId)) {
		throw new Error("Invalid review, reply, or user ID");
	}

	const reviewObjectId = new Types.ObjectId(reviewId);
	const replyObjectId = new Types.ObjectId(replyId);

	const review = await Review.findById(reviewObjectId);
	if (!review) {
		throw new Error("Review not found");
	}

	// Find the reply by matching the replyId
	const replyIndex = review.replies.findIndex((reply) => reply._id.toString() === replyObjectId.toString());
	if (replyIndex === -1) {
		throw new Error("Reply not found");
	}

	const reply = review.replies[replyIndex];

	// Ensure the logged-in user is the one who posted the reply
	if (reply.userId.toString() !== userId) {
		throw new Error("You are not authorized to edit this reply");
	}

	// Update the reply's comment
	review.replies[replyIndex].comment = updatedComment;

	await review.save();

	return review;
};

// Delete a reply
const deleteReply = async (reviewId: string, replyId: string, userId: string) => {
	if (!Types.ObjectId.isValid(reviewId) || !Types.ObjectId.isValid(replyId) || !Types.ObjectId.isValid(userId)) {
		throw new Error("Invalid review, reply, or user ID");
	}

	const reviewObjectId = new Types.ObjectId(reviewId);
	const replyObjectId = new Types.ObjectId(replyId);

	const review = await Review.findById(reviewObjectId);
	if (!review) {
		throw new Error("Review not found");
	}

	// Check if the reply exists in the replies array
	const replyIndex = review.replies.findIndex((r) => r._id.toString() === replyObjectId.toString());
	if (replyIndex === -1) {
		throw new Error("Reply not found");
	}

	const reply = review.replies[replyIndex];

	// Ensure the logged-in user is the one who posted the reply
	if (reply.userId.toString() !== userId) {
		throw new Error("You are not authorized to delete this reply");
	}

	// Manually remove the reply from the replies array by filtering it out
	review.replies = review.replies.filter((r) => r._id.toString() !== replyObjectId.toString());

	await review.save();

	return review;
};


export const ReviewService = {
	createReview,
	getReviewsByProductId,
	likeReview,
	replyToReview,
	editReview,
	deleteReview,
	editReply,
	deleteReply
};
