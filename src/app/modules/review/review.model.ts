import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

// Define the Mongoose schema for Review
const reviewSchema = new Schema<TReview>(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		replies: [
			{
				userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ensuring userId is required
				comment: { type: String, required: true }, // Marked as required for consistency
				userName: { type: String, required: true }, // Ensuring userName is required
				timestamp: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

// Create the Mongoose model for Review using the schema
const Review = model<TReview>('Review', reviewSchema);

export default Review;
