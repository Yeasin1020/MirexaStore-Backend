import { Schema, model } from "mongoose";
import { INewsletterSubscriber } from "./newsletter.interface";

const newsletterSchema = new Schema<INewsletterSubscriber>(
	{
		email: { type: String, required: true, unique: true },
		isFirstOrderDiscountAvailable: { type: Boolean, default: true },
		subscribedAt: { type: Date, default: Date.now },

	},
	{ timestamps: true }
);

export const NewsletterSubscriber = model<INewsletterSubscriber>(
	"NewsletterSubscriber",
	newsletterSchema
);
