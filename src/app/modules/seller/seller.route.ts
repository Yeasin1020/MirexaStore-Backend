// ✅ Route (seller.routes.ts)
import express from 'express';
import { SellerController } from './seller.controller';
import authenticate from '../../middlewares/authenticate';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';
import adminMiddleware from '../../middlewares/adminAuthorization';

const router = express.Router();

// Seller creates profile (authenticated + seller admin middleware)
router.post('/create-profile', authenticate, sellerAdminMiddleware, SellerController.createSellerProfile);

// Get seller profile by email (public)
router.get('/profile/:email', SellerController.getSellerByEmail);

// Get seller rating by email (public)
router.get('/rating/:email', SellerController.getSellerRating);

// Get seller by slug (public)
router.get('/slug/:slug', SellerController.getSellerBySlug);

// Admin route: extend seller validity by email (authenticated + seller admin middleware)
router.patch('/extend-validity/:email', authenticate, adminMiddleware, SellerController.extendSellerValidity);


router.get('/all-sellers', SellerController.getAllSellers)
export const SellerRoutes = router;
