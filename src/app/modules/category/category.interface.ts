import { Types } from 'mongoose';

export type TCategoryStatus = 'active' | 'inactive';

export interface TCategory {
	name: string;                // ক্যাটাগরির নাম
	slug: string;                // URL friendly slug (auto-generated)
	image?: string;              // ক্যাটাগরির ইমেজ (thumbnail)
	bannerImage?: string;        // বড় banner ইমেজ
	description?: string;        // ক্যাটাগরির ডেসক্রিপশন
	isFeatured?: boolean;        // হাইলাইটেড ক্যাটাগরি কি না
	status?: TCategoryStatus;    // active / inactive
	createdBy?: Types.ObjectId;  // ইউজার রেফারেন্স (optional)
	updatedBy?: Types.ObjectId;  // ইউজার রেফারেন্স (optional)
}
