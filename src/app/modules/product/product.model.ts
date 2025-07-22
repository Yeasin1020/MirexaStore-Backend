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
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 }, // Base price (can be overridden in variants)
		stockQuantity: { type: Number, required: true, min: 0, default: 0 }, // Total stock (optional summary)
		category: { type: String, required: true, trim: true },
		longDescription: { type: String },  // Added long description
		materials: { type: String, trim: true },        // Added materials field
		careInstructions: { type: String, trim: true }, // Added care instructions field
		specifications: { type: String, trim: true },    // Added specifications field
		additionalInfo: { type: String, trim: true },
		// Recommended Fields
		slug: { type: String, required: true, unique: true, trim: true },
		type: {
			type: String,
			enum: ["own", "affiliate"], // Only allow these two values
			required: true,
			default: "own",
		}, // ✅ Product type field
		affiliateLink: { type: String }, // ✅ Only for affiliate products
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
		status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft' },
		isFeatured: { type: Boolean, default: false },
		isNewArrival: { type: Boolean, default: false },

		// Seller (Optional)
		sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
		sellerName: { type: String, trim: true },
		sellerEmail: { type: String, trim: true },
		sellerNumber: { type: Number, default: 0 },
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
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'variants.sku': 1 }); // Variant SKU indexing

// ✅ Create Model
const Product = model<TProduct>('Product', productSchema);
export default Product;



