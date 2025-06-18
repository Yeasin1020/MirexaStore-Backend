import { TProduct } from "../product/product.interface";

export interface TCheckout {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_id: any;
	userId: string;
	items: {
		productId: string;
		quantity: number;
		sellerEmail: string;
		sellerName: string;
		price: number;
		color?: string;
		size?: string;
	}[];
	totalAmount: number;
	shippingCost: number;
	grandTotal: number;
	status: string;
	orderDate: Date;
	shippingDetails: {
		fullName: string;
		phone: string;
		email: string;
		address: string;
		city: string;
		district: string;
		deliveryNote: string;
		country: string;
	};
	deliveryNote: string;
	discountApplied?: number;
	isFirstOrderDiscountUsed?: boolean;
	totalPrice: number;

	// 🆕 Added Fields
	paymentMethod: "cod" | "bkash";
	transactionId?: string;
}

export interface TOrder {
	userId: string;
	items: TProduct[];
	totalAmount: number;
	shippingCost: number;
	grandTotal: number;
	status: string;
	shippingDetails: {
		fullName: string;
		phone: string;
		email: string;
		address: string;
		city: string;
		district: string;
		deliveryNote: string;
		country: string;
	};
	orderDate: string;
	discountApplied?: number;
	isFirstOrderDiscountUsed?: boolean;
	totalPrice: number;

	// 🆕 Added Fields
	paymentMethod: "cod" | "bkash";
	transactionId?: string;
}
