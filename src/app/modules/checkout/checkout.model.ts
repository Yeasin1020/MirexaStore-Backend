// import { Schema, model } from "mongoose";

// export interface TCheckout {
// 	orderId: string;  // ✅ Add this
// 	userId: string;
// 	items: Array<{
// 		sellerName: string;
// 		sellerEmail: string;
// 		productId: string;
// 		quantity: number;
// 		price: number;
// 		name?: string;
// 		color?: string;
// 		size?: string;
// 		productImage?: [];
// 	}>;
// 	totalAmount: number;
// 	shippingCost: number;
// 	grandTotal: number;
// 	status: string;
// 	orderDate: Date;
// 	shippingDetails: {
// 		fullName: string;
// 		phone: string;
// 		email: string;
// 		address: string;
// 		city: string;
// 		district: string;
// 		deliveryNote: string;
// 		country: string;
// 	};
// 	deliveryNote: string;
// 	discountApplied?: number;
// 	isFirstOrderDiscountUsed?: boolean;
// 	totalPrice: number;

// 	// Payment fields
// 	paymentStatus: "Pending" | "Success" | "Failed" | "Canceled";
// 	paymentAssignedToseller: boolean;
// 	sellerId: string | null;
// 	paymentApprovedByAdmin: boolean;
// 	adminId: string | null;
// 	adminApprovalDate: Date | null;
// }

// const checkoutSchema = new Schema<TCheckout>(
// 	{
// 		orderId: {
// 			type: String,
// 			required: true,
// 			unique: true  // ✅ Properly indexed
// 		},
// 		userId: { type: String, required: true },
// 		items: [
// 			{
// 				productId: { type: String, required: true },
// 				quantity: { type: Number, required: true },
// 				sellerEmail: { type: String },
// 				sellerName: { type: String },
// 				price: { type: Number, required: true },
// 				color: { type: String },
// 				size: { type: String },
// 				name: { type: String },
// 				productImage: { type: [String], default: [] }
// 			},
// 		],
// 		totalAmount: { type: Number, required: true },
// 		shippingCost: { type: Number, required: true },
// 		grandTotal: { type: Number, required: true },
// 		status: { type: String, required: true, default: "Processing" },
// 		orderDate: { type: Date, required: true },
// 		shippingDetails: {
// 			fullName: { type: String, required: true },
// 			phone: { type: String, required: true },
// 			email: { type: String, required: true },
// 			address: { type: String, required: true },
// 			city: { type: String, required: true },
// 			district: { type: String, required: true },
// 			deliveryNote: { type: String },
// 			country: { type: String, required: true },
// 		},
// 		deliveryNote: { type: String, required: true },
// 		discountApplied: { type: Number, default: 0 },
// 		isFirstOrderDiscountUsed: { type: Boolean, default: false },
// 		totalPrice: { type: Number, required: true },

// 		paymentStatus: {
// 			type: String,
// 			enum: ["Pending", "Success", "Failed", "Canceled"],
// 			default: "Pending",
// 		},
// 		paymentAssignedToseller: { type: Boolean, default: false },
// 		sellerId: { type: String, default: null },
// 		paymentApprovedByAdmin: { type: Boolean, default: false },
// 		adminId: { type: String, default: null },
// 		adminApprovalDate: { type: Date, default: null },
// 	},
// 	{ timestamps: true }
// );

// // ✅ DO NOT add a separate schema.index({ orderId: 1 }) if using unique:true above.

// const Checkout = model<TCheckout>("Checkout", checkoutSchema);

// export default Checkout;


import { Schema, model } from "mongoose";

export interface TCheckout {
	userId: string;
	items: Array<{
		sellerName: string;
		sellerEmail: string;
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
				sellerEmail: { type: String },
				sellerName: { type: String },
				price: { type: Number, required: true },
				color: { type: String },
				size: { type: String },
				name: { type: String },
				productImage: { type: [String], default: [] }
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
			deliveryNote: { type: String },
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