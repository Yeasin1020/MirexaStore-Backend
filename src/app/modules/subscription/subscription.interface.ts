export type TSubscriptionPlan = {
	_id?: string;
	title: string;
	days: number;
	price: number;

	// Optional enhancements
	description?: string;
	features?: string[];
	popular?: boolean;
	hot?: boolean;
	badgeColor?: string; // e.g., 'orange', 'blue', 'red'
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
};

export type TSubscriptionRequest = {
	_id?: string;
	sellerEmail: string;
	sellerName: string;
	planId: string;
	planTitle: string;
	price: number;
	paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | string;
	transactionId: string;
	status: 'pending' | 'approved' | 'rejected';
	createdAt?: Date;
};
