import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

// ✅ URL Validation Function
function arrayOfValidUrls(value: string[]): boolean {
	return value.every(url => /^https?:\/\//.test(url));
}

// ✅ Product Schema
const productSchema = new Schema<TProduct>(
	{
		// Basic Fields
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true },
		price: { type: Number, required: true, min: 0 }, // Base price (can be overridden in variants)
		stockQuantity: { type: Number, required: true, min: 0, default: 0 }, // Total stock (optional summary)
		category: { type: String, required: true, trim: true },

		// Recommended Fields
		slug: { type: String, required: true, trim: true },
		discountPrice: { type: Number, default: 0, min: 0 },
		brand: { type: String, trim: true },
		tags: { type: [String], default: [] },

		// ✅ Variants (Color + Size + SKU)
		variants: [
			{
				color: { type: String, },
				size: { type: String, },
				sku: { type: String, trim: true },
				price: { type: Number, min: 0 },
				stock: { type: Number, min: 0, default: 0 },
				images: {
					type: [String],
					validate: [arrayOfValidUrls, 'Please provide valid URLs for variant images'],

				}
			}
		],

		// Images and Media
		productImages: {
			type: [String],
			required: true,
			validate: [arrayOfValidUrls, 'Please provide valid URLs for images']
		},
		videoUrl: { type: String, trim: true },

		// Reviews and Ratings
		reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
		rating: { type: Number, default: 0, min: 0, max: 5 },
		totalReviews: { type: Number, default: 0 },

		// Product Status & Labels
		status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
		isFeatured: { type: Boolean, default: false },
		isNewArrival: { type: Boolean, default: false },

		// Seller (Optional)
		sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
		sellerName: { type: String, trim: true },

		// Optional Details
		features: { type: [String], default: [] },
		notes: { type: String, trim: true },

		// Shipping Information
		weight: { type: Number, default: 0 },
		dimensions: { type: String, trim: true },
		warranty: { type: String, trim: true },
	},
	{ timestamps: true }
);

// ✅ Indexing
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'variants.sku': 1 }); // Variant SKU indexing

// ✅ Create Model
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
// 		name: { type: String, required: true, trim: true },  // Product name
// 		description: { type: String, required: true, trim: true },  // Product description
// 		price: { type: Number, required: true, min: 0 },  // Price should be a positive number
// 		stockQuantity: { type: Number, required: true, min: 0, default: 0 },  // Quantity in stock (default to 0)
// 		category: { type: String, required: true, trim: true },  // Category of the product
// 		productImages: {
// 			type: [String],  // Array of image URLs
// 			required: true,  // This field is required
// 			validate: [arrayOfValidUrls, 'Please provide valid URLs for images'],  // Validation to ensure valid URLs
// 		},
// 		reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],  // Array of ObjectId references to Review model
// 	},
// 	{ timestamps: true }  // Add timestamps for createdAt and updatedAt
// );

// // Create the Mongoose model for Product using the schema
// const Product = model<TProduct>('Product', productSchema);

// export default Product;



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
