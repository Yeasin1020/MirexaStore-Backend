// ✅ Route (follow.routes.ts)
import express from 'express';
import authenticate from '../../middlewares/authenticate';
import { handleFollow, handleGetFollowersCount, handleIsFollowing, handleUnfollow } from './follow.controller';

const router = express.Router();

router.post('/follow', authenticate, handleFollow);
router.post('/unfollow', authenticate, handleUnfollow);
router.get('/followers/:sellerId', handleGetFollowersCount);
router.get('/is-following', authenticate, handleIsFollowing);

export const FollowRoutes = router;
