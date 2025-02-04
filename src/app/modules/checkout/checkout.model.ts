import { Schema, model } from "mongoose";

export interface TCheckout {
	userId: string;
	items: Array<{
		productId: string;
		quantity: number;
		price: number;
	}>;
	totalAmount: number;
	shippingCost: number;
	grandTotal: number;
	status: string;
	orderDate: Date;  // Use Date type for orderDate
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

const checkoutSchema = new Schema<TCheckout>(
	{
		userId: { type: String, required: true },
		items: [
			{
				productId: { type: String, required: true },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
			},
		],
		totalAmount: { type: Number, required: true },
		shippingCost: { type: Number, required: true },
		grandTotal: { type: Number, required: true },
		status: { type: String, required: true, default: "Processing" },
		orderDate: { type: Date, required: true },  // Correctly defined as Date
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
	},
	{ timestamps: true }
);

const Checkout = model<TCheckout>("Checkout", checkoutSchema);

export default Checkout;
