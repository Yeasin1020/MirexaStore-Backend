// ✅ Updated seller Service (seller.service.ts)
import Product from '../product/product.model';
import Review from '../review/review.model';
import { User } from '../user/user.model';
import { TSellerProfile } from './seller.interface';
import { Seller } from './seller.model';

export const SellerService = {
	createProfile: async (userId: string, data: TSellerProfile) => {
		// Find the user by ID
		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		// ❗ Check if the user with the email exists and if the role is 'user' (not 'seller')
		const existingUser = await User.findOne({ email: data.userEmail });
		if (!existingUser) throw new Error('No user exists with this email');

		// Check if the existing user has a 'seller' role
		if (existingUser.role === 'user') {
			throw new Error('You are not seller');
		}

		// Set the user's role to 'seller'
		user.role = 'seller';
		await user.save();

		// ✅ Now create the seller profile with the provided data
		const profile = await Seller.create({ ...data, userEmail: existingUser.email });
		return profile;
	},

	getSellerByEmail: async (email: string) => {
		return Seller.findOne({ userEmail: email });
	},
};

const getSellerRating = async (sellerEmail: string) => {
	// 1. Get product IDs directly with projection
	const productIds = await Product.find(
		{ sellerEmail: sellerEmail },
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
const getSellerBySlug = async (slug: string) => {
	return await Seller.findOne({ 'brand.slug': slug });
};
export const SellerServices = {
	// ...other methods
	getSellerRating,
	getSellerBySlug
};