import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
	{
		reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		reseller: { type: Schema.Types.ObjectId, ref: 'Reseller', required: true },
		reason: { type: String, required: true },
		details: { type: String },
		status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
	},
	{ timestamps: true }
);

export const Report = model('Report', reportSchema);
