import { Document, Types } from 'mongoose';

export type TProduct = {
	// Basic Fields
	name: string;
	description: string;
	price: number;
	stockQuantity: number;
	category: string;

	// Recommended Additional Fields
	longDescription?: string;
	materials?: string;
	careInstructions?: string;
	specifications?: string;
	additionalInfo?: string;

	// Recommended Fields
	slug: string;
	discountPrice?: number;
	SKU?: string;
	brand?: string;
	tags?: string[];

	// Variants (Color + Size + SKU)
	variants: Array<{
		color: string;
		size: string;
		sku: string;
		price: number;
		stock: number;
		images: string[];
	}>;

	// Images and Media
	productImages: string[];
	videoUrl?: string;

	// Reviews and Ratings
	reviews: Types.ObjectId[];
	rating?: number;
	totalReviews?: number;

	// Product Type
	type: 'own' | 'affiliate';
	affiliateLink?: string;

	// Product Status & Labels
	status?: 'active' | 'inactive' | 'draft';
	isFeatured?: boolean;
	isNewArrival?: boolean;

	// Seller (Optional)
	sellerId?: Types.ObjectId;
	sellerName?: string;
	sellerEmail?: string;
	sellerNumber: number;

	// Optional Details
	features?: string[];
	notes?: string;

	// Shipping Information
	weight?: number;
	dimensions?: string;
	warranty?: string;

	// Deletion Info
	deletedBy?: 'admin' | 'seller' | null;
	isDeleted: boolean;

	// ✅ Delivery Info (Updated)
	deliveryCharges?: Array<{
		division: string;
		district: string;
		charge: number;
	}>;

	defaultDeliveryCharge?: number;


} & Document;
