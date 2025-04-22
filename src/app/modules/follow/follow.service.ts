import { Follow } from "./follow.model";

export const followReseller = async (userId: string, resellerId: string) => {
	const existingFollow = await Follow.findOne({ user: userId, reseller: resellerId });
	if (existingFollow) throw new Error('Already following this reseller');

	const follow = new Follow({ user: userId, reseller: resellerId });
	return await follow.save();
};

export const unfollowReseller = async (userId: string, resellerId: string) => {
	const result = await Follow.findOneAndDelete({ user: userId, reseller: resellerId });
	if (!result) throw new Error('Not following this reseller');
	return result;
};

export const getFollowersCount = async (resellerId: string) => {
	return await Follow.countDocuments({ reseller: resellerId });
};

export const isFollowing = async (userId: string, resellerId: string) => {
	const follow = await Follow.findOne({ user: userId, reseller: resellerId });
	return !!follow;
};
