import { Schema, model } from 'mongoose';
import { TSellerProfile } from './seller.interface';

const sellerSchema = new Schema<TSellerProfile>(
	{
		userEmail: { type: String, required: true, unique: true },

		// ⏰ Seller validity expiry date - default 7days from creation
		validTill: {
			type: Date,
			required: true,
			default: () => {
				const now = new Date();
				now.setDate(now.getDate() + 7); // default validity = 7 days
				return now;
			},
		},


		brand: {
			name: { type: String, required: true },
			slug: { type: String, required: true, unique: true },
			logo: { type: String, required: true },         // required
			banner: { type: String, required: true },       // required
			tagline: { type: String, default: '' },         // optional
			description: { type: String, required: true },  // required
			location: { type: String, required: true },     // required
			phone: { type: String, required: true },        // required
			whatsapp: { type: String, required: true },     // required
			bkash: { type: String, required: true },     // required
			socialLinks: {
				facebook: { type: String, required: true },   // required
				instagram: { type: String, required: true },  // required
			},
			verified: { type: Boolean, default: false },
			joinedAt: { type: Date, default: Date.now },
		},
	},
	{ timestamps: true }
);

export const Seller = model<TSellerProfile>('Seller', sellerSchema);
