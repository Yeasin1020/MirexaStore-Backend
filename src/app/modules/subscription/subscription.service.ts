import { SubscriptionPlan, SubscriptionRequest } from './subscription.model';
import { TSubscriptionPlan, TSubscriptionRequest } from './subscription.interface';
import { Seller } from '../seller/seller.model';

export const SubscriptionService = {
	getAllPlans: async () => {
		return SubscriptionPlan.find({});
	},
	createPlan: async (data: TSubscriptionPlan) => {
		return SubscriptionPlan.create(data);
	},
	createRequest: async (data: TSubscriptionRequest) => {
		// Prevent duplicate txns
		const exists = await SubscriptionRequest.findOne({ transactionId: data.transactionId });
		if (exists) throw new Error('Duplicate transaction ID. Already used.');

		return SubscriptionRequest.create(data);
	},
	getRequestsBySeller: async (email: string) => {
		return SubscriptionRequest.find({ sellerEmail: email }).sort({ createdAt: -1 });
	},

	getPendingRequests: async () => {
		return SubscriptionRequest.find({ status: 'pending' });
	},

	approveRequest: async (requestId: string) => {
		const req = await SubscriptionRequest.findById(requestId);
		if (!req) throw new Error('Request not found');

		// Mark as approved
		req.status = 'approved';
		await req.save();

		// Extend seller validity
		const seller = await Seller.findOne({ userEmail: req.sellerEmail });
		if (!seller) throw new Error('Seller not found');

		const now = new Date();
		const validFrom = seller.validTill > now ? new Date(seller.validTill) : now;
		validFrom.setDate(validFrom.getDate() + Number(req.planId)); // safer if planId holds days

		seller.validTill = validFrom;
		await seller.save();

		return req;
	},

	rejectRequest: async (requestId: string) => {
		const req = await SubscriptionRequest.findById(requestId);
		if (!req) throw new Error('Request not found');

		req.status = 'rejected';
		await req.save();
		return req;
	},
};
