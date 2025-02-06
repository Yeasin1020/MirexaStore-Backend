import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface'; // Assuming the interface is in a separate file

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
		reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],  // Array of ObjectId references to Review model
	},
	{ timestamps: true }  // Add timestamps for createdAt and updatedAt
);

// Create the Mongoose model for Product using the schema
const Product = model<TProduct>('Product', productSchema);

export default Product;
