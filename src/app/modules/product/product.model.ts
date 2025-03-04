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



// import { Schema, model } from 'mongoose';
// import { TProduct } from './product.interface'; // Assuming the interface is in a separate file

// // Validation function for product images (URL validation)
// function arrayOfValidUrls(value: string[]): boolean {
// 	return value.every(url => /^https?:\/\//.test(url)); // Ensures it's a valid URL
// }

// // Define the Mongoose schema for Product
// const productSchema = new Schema<TProduct>(
// 	{
// 		name: { type: String, required: true, trim: true }, // Product title
// 		slug: { type: String, required: true, unique: true, trim: true }, // Unique slug for SEO
// 		description: { type: String, required: true, trim: true }, // Full details of the product
// 		price: { type: Number, required: true, min: 0 }, // Original price
// 		discountPrice: { type: Number, default: 0, min: 0 }, // Discounted price (optional)
// 		stock: { type: Number, required: true, min: 0, default: 0 }, // Available stock quantity
// 		category: { type: String, required: true, trim: true }, // Product category
// 		brand: { type: String, required: true, trim: true }, // Product brand
// 		images: {
// 			type: [String],
// 			required: true,
// 			validate: [arrayOfValidUrls, 'Please provide valid URLs for images'], // Validation for valid image URLs
// 		},
// 		tags: { type: [String], default: [] }, // Tags related to the product
// 		rating: { type: Number, default: 0, min: 0, max: 5 }, // Average rating (0 to 5)
// 		totalReviews: { type: Number, default: 0 }, // Total number of reviews
// 		status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' }, // Product status
// 		reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }], // Array of ObjectId references to Review model
// 	},
// 	{ timestamps: true } // Automatically adds createdAt and updatedAt fields
// );

// // Create the Mongoose model for Product using the schema
// const Product = model<TProduct>('Product', productSchema);

// export default Product;
