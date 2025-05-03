import { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

// Define the Mongoose schema for Review
const reviewSchema = new Schema<TReview>(
	{
		productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		userName: { type: String },
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		replies: [
			{
				userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
				comment: { type: String, required: true },
				userName: { type: String, required: true },
				timestamp: { type: Date, default: Date.now },
			},
		],
		media: {
			type: [
				{
					url: { type: String, required: true },
					type: { type: String, enum: ['image', 'video'], required: true },
				},
			],
			required: false,
			default: undefined, // makes it optional
		},
	},
	{ timestamps: true }
);

// Create the Mongoose model for Review using the schema
const Review = model<TReview>('Review', reviewSchema);

export default Review;
