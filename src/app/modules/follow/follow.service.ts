import { Follow } from "./follow.model";

export const followSeller = async (userId: string, sellerId: string) => {
	const existingFollow = await Follow.findOne({ user: userId, seller: sellerId });
	if (existingFollow) throw new Error('Already following this seller');

	const follow = new Follow({ user: userId, seller: sellerId });
	return await follow.save();
};

export const unfollowSeller = async (userId: string, sellerId: string) => {
	const result = await Follow.findOneAndDelete({ user: userId, seller: sellerId });
	if (!result) throw new Error('Not following this seller');
	return result;
};

export const getFollowersCount = async (sellerId: string) => {
	return await Follow.countDocuments({ seller: sellerId });
};

export const isFollowing = async (userId: string, sellerId: string) => {
	const follow = await Follow.findOne({ user: userId, seller: sellerId });
	return !!follow;
};
