import { Schema, model } from "mongoose";
import { ICourierRequest } from "./courier.interface";

const courierSchema = new Schema<ICourierRequest>(
  {
    orderId: { type: String, required: true, unique: true },

    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      deliveryNote: { type: String },  // optional
      country: { type: String, required: true },
    },

    seller: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      location: { type: String, required: true },
      whatsapp: { type: String }, // optional
      socialLinks: {
        facebook: { type: String },
        instagram: { type: String },
      },
    },

    orderItems: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        color: { type: String },  // optional
        size: { type: String },   // optional
        productImage: { type: [String], required: true }, // array of string
      },
    ],

    codAmount: { type: Number, required: true },
    trackingId: { type: String },
    responsePayload: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

courierSchema.index({ orderId: 1 }, { unique: true });

export const Courier = model<ICourierRequest>("Courier", courierSchema);
