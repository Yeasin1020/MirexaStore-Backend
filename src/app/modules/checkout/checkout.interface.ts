// interfaces/checkout.interface.ts

import { TProduct } from "../product/product.interface";



export interface TCheckout {
	userId: string;
	items: {
		productId: string;
		quantity: number;
		price: number;
	}[];
	totalAmount: number;
	shippingCost: number;
	grandTotal: number;
	status: string;
	orderDate: string;
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
}
