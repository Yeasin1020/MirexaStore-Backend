// ✅ Updated seller Service (seller.service.ts)
import Product from '../product/product.model';
import Review from '../review/review.model';
import { User } from '../user/user.model';
import { TSellerProfile } from './seller.interface';
import { Seller } from './seller.model';


export const SellerService = {

	createProfile: async (userId: string, data: TSellerProfile) => {
		// 1️⃣ Ensure the user exists
		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');


		// 2️⃣ Verify the email matches a user
		const existingUser = await User.findOne({ email: data.userEmail });
		if (!existingUser) throw new Error('No user exists with this email');

		// 3️⃣ Check if user is already an approved seller
		if (existingUser.role !== 'seller') {
			throw new Error('User is not approved as a seller yet');
		}

		// 4️⃣ Prevent creating multiple profiles for same user
		const existingProfile = await Seller.findOne({ userEmail: existingUser.email });
		if (existingProfile) {
			throw new Error('Seller profile already exists for this user');
		}

		// 5️⃣ Check for unique brand slug
		const slugExists = await Seller.findOne({ 'brand.slug': data.brand.slug });
		if (slugExists) {
			throw new Error('Brand slug already exists. Choose a different one.');
		}

		// 6️⃣ Set 30-day validity period from now
		const validTill = new Date();
		validTill.setDate(validTill.getDate() + 30);

		// 7️⃣ Create seller profile
		const profile = await Seller.create({
			...data,
			userEmail: existingUser.email,
			validTill,
		});

		return profile;
	},

	/**
	 * 📩 Get seller profile by user email
	 */
	getSellerByEmail: async (email: string) => {
		return Seller.findOne({ userEmail: email });
	},

	/**
	 * 🛠 Admin only: Extend an existing seller's validity
	 */
	extendSellerValidity: async (email: string, extraDays: number) => {
		const seller = await Seller.findOne({ userEmail: email });
		if (!seller) throw new Error('Seller not found');

		const now = new Date();

		// If current validity is still active, extend from that date
		const currentValidTill =
			seller.validTill && new Date(seller.validTill) > now
				? new Date(seller.validTill)
				: now;

		currentValidTill.setDate(currentValidTill.getDate() + extraDays);

		seller.validTill = currentValidTill;
		await seller.save();

		return seller;
	},

	getAllSellers: async () => {
		return Seller.find({}).lean();
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