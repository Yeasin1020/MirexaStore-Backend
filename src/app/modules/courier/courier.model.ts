// modules/courier/courier.model.ts

import { Schema, model } from "mongoose";
import { ICourierRequest } from "./courier.interface";

const courierSchema = new Schema<ICourierRequest>(
	{
		orderId: { type: String, required: true },

		customer: {
			fullName: String,
			phone: String,
			email: String,
			address: String,
			city: String,
			district: String,
			deliveryNote: String,
			country: String,
		},

		seller: {
			name: String,
			email: String,
			phone: String,
			location: String,
			whatsapp: String,
			socialLinks: {
				facebook: String,
				instagram: String,
			},
		},

		orderItems: [
			{
				productName: String,
				quantity: Number,
				price: Number,
				color: String,
				size: String,
				productImage: String,
			},
		],

		codAmount: { type: Number, required: true },
		trackingId: String,
		responsePayload: Schema.Types.Mixed,
	},
	{ timestamps: true }
);

export const Courier = model<ICourierRequest>("Courier", courierSchema);
