

import mongoose, { Schema, Document, Types } from 'mongoose';

interface IResellerRequest extends Document {
	user: Types.ObjectId; // User who requested to be a reseller (referencing the User model)
	status: 'pending' | 'approved' | 'rejected';
	productType: string; // Type of products they want to sell
	phone: string; // Phone number of the user
	company?: string; // Optional company name
	additionalInfo?: string; // Optional additional info from the user
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

const ResellerRequestSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		email: { type: String },
		productType: { type: String, require: true },
		phone: { type: String, require: true }, // Optional field for phone number
		company: { type: String }, // Optional field for company name
		additionalInfo: { type: String }, // Optional field for additional info
	},
	{
		timestamps: true,
	}
);

const ResellerRequest = mongoose.model<IResellerRequest>('ResellerRequest', ResellerRequestSchema);

export { ResellerRequest, IResellerRequest };
