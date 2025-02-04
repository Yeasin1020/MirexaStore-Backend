import { Schema, model } from 'mongoose';

// Define the interface for a Product
export interface TProduct {
	name: string;
	description: string;
	price: number;
	stockQuantity: number;
	category: string;
	productImages: string[];
}

// Validation function for product images (URL validation)
function arrayOfValidUrls(value: string[]): boolean {
	return value.every(url => /^https?:\/\//.test(url)); // Ensures it's a valid URL
}

// Define the Mongoose schema for Product
const productSchema = new Schema<TProduct>(
	{
		name: { type: String, required: true, trim: true },  // Product name
		description: { type: String, required: true, trim: true },  // Product description
		price: { type: Number, required: true, min: 0 },  // Price should be a positive number
		stockQuantity: { type: Number, required: true, min: 0, default: 0 },  // Quantity in stock (default to 0)
		category: { type: String, required: true, trim: true },  // Category of the product
		productImages: {
			type: [String],  // Array of image URLs
			required: true,  // This field is required
			validate: [arrayOfValidUrls, 'Please provide valid URLs for images'],  // Validation to ensure valid URLs
		},
	},
	{ timestamps: true }  // Add timestamps for createdAt and updatedAt
);

// Create the Mongoose model for Product using the schema
const Product = model<TProduct>('Product', productSchema);

export default Product;
