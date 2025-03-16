export interface OrderItem {
	color: string;
	size: string;
	name: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_id?: any;
	productId: string;
	quantity: number;
	price: number;
}

export interface OrderEmailData {
	to: string;
	name: string;
	phone: string;
	address: string;
	city: string;
	deliveryNote: string;
	country: string;
	district: string;
	orderId: string;
	items: OrderItem[];
	totalAmount: number;
	shippingCost: number;
	discountApplied: number;
	totalPrice: number;
}
