import { Schema, model } from 'mongoose';

const followSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // follower
		reseller: { type: Schema.Types.ObjectId, ref: 'Reseller', required: true }, // followed
	},
	{ timestamps: true }
);

followSchema.index({ user: 1, reseller: 1 }, { unique: true }); // prevent duplicate follows

export const Follow = model('Follow', followSchema);
