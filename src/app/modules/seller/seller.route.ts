// ✅ Route (seller.routes.ts)
import express from 'express';
import { SellerController } from './seller.controller';
import authenticate from '../../middlewares/authenticate';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';

const router = express.Router();

router.post('/create-profile', authenticate, sellerAdminMiddleware, SellerController.createSeller);

router.get('/profile/:email', SellerController.getSellerByEmail); // 👈 New Route

router.get('/rating/:email', SellerController.getSellerRating);

router.get('/slug/:slug', SellerController.getSellerBySlug);

export const SellerRoutes = router;
