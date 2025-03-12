import { Document, Types } from 'mongoose';

export type TProduct = {
	// Basic Fields
	name: string;
	description: string;
	price: number;
	stockQuantity: number;
	category: string;

	// Recommended Additional Fields
	slug: string;
	discountPrice?: number;
	SKU?: string; // This can now be replaced by SKU for each variant
	brand?: string;
	tags?: string[];

	// ✅ Variants (Color + Size + SKU)
	variants: Array<{
		color: string;
		size: string;
		sku: string; // Unique SKU for each variant
		price: number;
		stock: number;
		images: string[]; // Array of image URLs specific to this variant
	}>;

	// Images and Media
	productImages: string[];
	videoUrl?: string;

	// Reviews and Ratings
	reviews: Types.ObjectId[]; // Array of Review IDs
	rating?: number;
	totalReviews?: number;

	// Product Status & Labels
	status?: 'active' | 'inactive' | 'draft';
	isFeatured?: boolean;
	isNewArrival?: boolean;

	// Seller (Optional)
	sellerId?: Types.ObjectId; // Reference to User model
	sellerName?: string;

	// Optional Details
	features?: string[];
	notes?: string;

	// Shipping Information
	weight?: number;
	dimensions?: string;
	warranty?: string;
} & Document;
