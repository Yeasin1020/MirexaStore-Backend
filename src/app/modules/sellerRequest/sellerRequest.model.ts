

import mongoose, { Schema, Document, Types } from 'mongoose';

interface ISellerRequest extends Document {
	user: Types.ObjectId; // User who requested to be a seller (referencing the User model)
	status: 'pending' | 'approved' | 'rejected';
	productType: string; // Type of products they want to sell
	phone: string; // Phone number of the user
	company?: string; // Optional company name
	additionalInfo?: string; // Optional additional info from the user
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

const SellerRequestSchema: Schema = new Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		status: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},
		email: { type: String },
		productType: { type: String, required: true },
		phone: { type: String, required: true },
		company: { type: String }, // Optional field for company name
		additionalInfo: { type: String }, // Optional field for additional info
	},
	{
		timestamps: true,
	}
);

const SellerRequest = mongoose.model<ISellerRequest>('SellerRequest', SellerRequestSchema);

export { SellerRequest, ISellerRequest };
