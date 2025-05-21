
import { Schema, model } from 'mongoose';
import { TSellerProfile } from './seller.interface';

const sellerSchema = new Schema<TSellerProfile>(
	{
		userEmail: { type: String, required: true, unique: true },
		brand: {
			name: { type: String, required: true },
			slug: { type: String, required: true, unique: true },
			logo: { type: String },
			banner: { type: String },
			tagline: { type: String },
			description: { type: String },
			location: { type: String },
			phone: { type: String }, // 📞 Phone Number
			whatsapp: { type: String }, // 💬 WhatsApp Number
			socialLinks: {
				facebook: { type: String },
				instagram: { type: String },
			},
			verified: { type: Boolean, default: false },
			joinedAt: { type: Date, default: Date.now },
		},
	},
	{ timestamps: true }
);

export const Seller = model<TSellerProfile>('Seller', sellerSchema);
