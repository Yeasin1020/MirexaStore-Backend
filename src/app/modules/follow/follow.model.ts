import { Schema, model } from 'mongoose';

const followSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // follower
		seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }, // followed
	},
	{ timestamps: true }
);

followSchema.index({ user: 1, seller: 1 }, { unique: true }); // prevent duplicate follows

export const Follow = model('Follow', followSchema);
