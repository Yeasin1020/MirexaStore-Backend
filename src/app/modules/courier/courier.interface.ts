import { Document } from "mongoose";

export interface ICourierRequest extends Document {
  orderId: string;

  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    deliveryNote?: string; // optional
    country: string;
  };

  seller: {
    name: string;
    email: string;
    phone: string;
    location: string;
    whatsapp?: string; // optional
    socialLinks?: {
      facebook?: string;
      instagram?: string;
    };
  };

  orderItems: {
    productName: string;
    quantity: number;
    price: number;
    color?: string;  // optional
    size?: string;   // optional
    productImage: string[];  // now array of string, important!
  }[];

  codAmount: number;
  trackingId?: string;
  responsePayload?: unknown;
}
