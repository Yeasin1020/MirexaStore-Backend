import { Schema, model } from 'mongoose';

export interface TProduct {
	name: string;
	description: string;
	price: number;
	stockQuantity: number;
	category: string;
	productImages: string[];
}

const productSchema = new Schema<TProduct>(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		price: { type: Number, required: true },
		stockQuantity: { type: Number, required: true, default: 0 },
		category: { type: String, required: true, trim: true },
		productImages: { type: [String], required: true },
	},
	{ timestamps: true }
);

const Product = model<TProduct>('Product', productSchema);

export default Product;
