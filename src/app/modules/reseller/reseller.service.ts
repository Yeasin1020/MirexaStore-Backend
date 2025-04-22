// ✅ Updated Reseller Service (reseller.service.ts)
import Product from '../product/product.model';
import Review from '../review/review.model';
import { User } from '../user/user.model';
import { TResellerProfile } from './reseller.interface';
import { Reseller } from './reseller.model';

export const ResellerService = {
	createProfile: async (userId: string, data: TResellerProfile) => {
		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		// ❗ Check if the user with the email exists and if the role is 'user' (not 'reseller')
		const existingUser = await User.findOne({ email: data.userEmail });
		if (!existingUser) throw new Error('No user exists with this email');

		// Check if the existing user has a 'reseller' role
		if (existingUser.role === 'user') {
			throw new Error('You are not reseller');
		}

		// Set the user's role to 'reseller'
		user.role = 'reseller';
		await user.save();

		// ✅ Now create the reseller profile with the provided data
		const profile = await Reseller.create({ ...data, userEmail: existingUser.email });
		return profile;
	},

	getResellerByEmail: async (email: string) => {
		return Reseller.findOne({ userEmail: email });
	},
};

const getResellerRating = async (resellerEmail: string) => {
	// 1. Get product IDs directly with projection
	const productIds = await Product.find(
		{ sellerEmail: resellerEmail },
		{ _id: 1 }
	).lean();

	if (!productIds.length) {
		return { averageRating: 0, totalReviews: 0 };
	}

	const ids = productIds.map(p => p._id);

	// 2. Get aggregated rating in MongoDB itself (faster than JS)
	const ratingStats = await Review.aggregate([
		{ $match: { productId: { $in: ids } } },
		{
			$group: {
				_id: null,
				totalRating: { $sum: "$rating" },
				totalReviews: { $sum: 1 },
			},
		},
	]);

	if (!ratingStats.length) {
		return { averageRating: 0, totalReviews: 0 };
	}

	const { totalRating, totalReviews } = ratingStats[0];

	return {
		averageRating: Number((totalRating / totalReviews).toFixed(1)),
		totalReviews,
	};
};
const getResellerBySlug = async (slug: string) => {
	return await Reseller.findOne({ 'brand.slug': slug });
};
export const ResellerServices = {
	// ...other methods
	getResellerRating,
	getResellerBySlug
};