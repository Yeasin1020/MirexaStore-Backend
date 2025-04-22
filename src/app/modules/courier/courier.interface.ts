// modules/courier/courier.interface.ts

export interface ICourierRequest {
	orderId: string;
	customer: {
		fullName: string;
		phone: string;
		email: string;
		address: string;
		city: string;
		district: string;
		deliveryNote?: string;
		country: string;
	};
	seller: {
		name: string;
		email: string;
		phone: string;
		location: string;
		whatsapp?: string;
		socialLinks?: {
			facebook?: string;
			instagram?: string;
		};
	};
	orderItems: {
		productName: string;
		quantity: number;
		price: number;
		color?: string;
		size?: string;
		productImage: string;
	}[];
	codAmount: number;
	trackingId?: string;
	responsePayload?: unknown;
}
