import { Schema, model } from "mongoose";

export interface TCheckout {
	userId: string;
	items: Array<{
		productId: string;
		quantity: number;
		price: number;
		name?: string;
		color?: string;
		size?: string;
		productImage?: [];
	}>;
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
}

const checkoutSchema = new Schema<TCheckout>(
	{
		userId: { type: String, required: true },
		items: [
			{
				productId: { type: String, required: true },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
				color: { type: String },
				size: { type: String },
				name: { type: String },
				productImage: []
			},
		],
		totalAmount: { type: Number, required: true },
		shippingCost: { type: Number, required: true },
		grandTotal: { type: Number, required: true },
		status: { type: String, required: true, default: "Processing" },
		orderDate: { type: Date, required: true },
		shippingDetails: {
			fullName: { type: String, required: true },
			phone: { type: String, required: true },
			email: { type: String, required: true },
			address: { type: String, required: true },
			city: { type: String, required: true },
			district: { type: String, required: true },
			deliveryNote: { type: String, required: true },
			country: { type: String, required: true },
		},
		deliveryNote: { type: String, required: true },
		discountApplied: { type: Number, default: 0 },
		isFirstOrderDiscountUsed: { type: Boolean, default: false },
		totalPrice: { type: Number, required: true },
	},
	{ timestamps: true }
);

const Checkout = model<TCheckout>("Checkout", checkoutSchema);

export default Checkout;
