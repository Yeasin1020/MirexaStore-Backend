import { Schema, model } from 'mongoose';
import { TSubscriptionPlan, TSubscriptionRequest } from './subscription.interface';

const planSchema = new Schema<TSubscriptionPlan>({
	title: { type: String, required: true },
	days: { type: Number, required: true },
	price: { type: Number, required: true },
});

const requestSchema = new Schema<TSubscriptionRequest>(
	{
		sellerEmail: { type: String, required: true },
		sellerName: { type: String, required: true },
		planId: { type: String, required: true },
		planTitle: { type: String, required: true },
		price: { type: Number, required: true },
		paymentMethod: { type: String, required: true },
		transactionId: { type: String, required: true, unique: true },
		status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	},
	{ timestamps: true }
);

export const SubscriptionPlan = model<TSubscriptionPlan>('SubscriptionPlan', planSchema);
export const SubscriptionRequest = model<TSubscriptionRequest>('SubscriptionRequest', requestSchema);
