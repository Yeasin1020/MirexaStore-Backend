import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

// ✅ URL Validation Function
function arrayOfValidUrls(value: string[]): boolean {
	return value.every((url) => /^https?:\/\//.test(url));
}

// ✅ Product Schema
const productSchema = new Schema<TProduct>(
	{
		// Basic Fields
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		stockQuantity: { type: Number, required: true, min: 0, default: 0 },
		category: { type: String, required: true, trim: true },
		longDescription: { type: String },
		materials: { type: String, trim: true },
		careInstructions: { type: String, trim: true },
		specifications: { type: String, trim: true },
		additionalInfo: { type: String, trim: true },

		// Recommended Fields
		slug: { type: String, required: true, unique: true, trim: true },
		type: {
			type: String,
			enum: ['own', 'affiliate'],
			required: true,
			default: 'own',
		},
		affiliateLink: { type: String },
		discountPrice: { type: Number, default: 0, min: 0 },
		brand: { type: String, trim: true },
		tags: { type: [String], default: [] },

		// ✅ Variants
		variants: [
			{
				color: { type: String },
				size: { type: String },
				sku: { type: String, trim: true },
				price: { type: Number, min: 0 },
				stock: { type: Number, min: 0, default: 0 },
				images: {
					type: [String],
					validate: [
						arrayOfValidUrls,
						'Please provide valid URLs for variant images',
					],
				},
			},
		],

		// ✅ Images and Media
		productImages: {
			type: [String],
			required: true,
			validate: [arrayOfValidUrls, 'Please provide valid URLs for images'],
		},
		videoUrl: { type: String, trim: true },

		// ✅ Delivery Charges by District and Upazila
		deliveryCharges: {
			type: [
				{
					division: { type: String, required: true, trim: true },
					district: { type: String, required: true, trim: true },
					charge: { type: Number, required: true, min: 0 },
				},
			],
			default: [],
		},

		defaultDeliveryCharge: {
			type: Number,
			default: 0,
			min: 0,
		},



		// ✅ Reviews and Ratings
		reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
		rating: { type: Number, default: 0, min: 0, max: 5 },
		totalReviews: { type: Number, default: 0 },

		// ✅ Product Status & Labels
		status: {
			type: String,
			enum: ['active', 'inactive', 'draft'],
			default: 'draft',
		},
		isFeatured: { type: Boolean, default: false },
		isNewArrival: { type: Boolean, default: false },

		// ✅ Seller
		sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
		sellerName: { type: String, trim: true },
		sellerEmail: { type: String, trim: true },
		sellerNumber: { type: Number, default: 0 },

		// ✅ Optional Details
		features: { type: [String], default: [] },
		notes: { type: String, trim: true },

		// ✅ Shipping Information
		weight: { type: Number, default: 0 },
		dimensions: { type: String, trim: true },
		warranty: { type: String, trim: true },

		// ✅ Deletion Flags
		deletedBy: {
			type: String,
			enum: ['admin', 'seller', null],
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// ✅ Indexing
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'variants.sku': 1 });

// ✅ Create Model
const Product = model<TProduct>('Product', productSchema);
export default Product;
