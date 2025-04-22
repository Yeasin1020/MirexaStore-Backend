import { Request, Response } from 'express';
import { followReseller, getFollowersCount, isFollowing, unfollowReseller } from './follow.service';


export const handleFollow = async (req: Request, res: Response) => {
	const { resellerId } = req.body;
	const userId = req.user._id;
	try {
		const follow = await followReseller(userId, resellerId);
		res.status(201).json({ success: true, message: 'Followed successfully', data: follow });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const handleUnfollow = async (req: Request, res: Response) => {
	const { resellerId } = req.body;
	const userId = req.user._id;
	try {
		const unfollow = await unfollowReseller(userId, resellerId);
		res.status(200).json({ success: true, message: 'Unfollowed successfully', data: unfollow });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const handleGetFollowersCount = async (req: Request, res: Response) => {
	const { resellerId } = req.params;

	try {
		const count = await getFollowersCount(resellerId);
		res.status(200).json({ success: true, followers: count });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};

export const handleIsFollowing = async (req: Request, res: Response) => {
	const { resellerId } = req.query;
	const userId = req.user?._id;

	if (!userId) {
		return res.status(401).json({ success: false, message: "Unauthorized: No user found" });
	}

	if (!resellerId) {
		return res.status(400).json({ success: false, message: "Bad request: Missing resellerId" });
	}

	try {
		const following = await isFollowing(userId as string, resellerId as string);
		res.status(200).json({ success: true, isFollowing: following });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};

