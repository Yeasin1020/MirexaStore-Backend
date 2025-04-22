// ✅ Route (reseller.routes.ts)
import express from 'express';
import { ResellerController } from './reseller.controller';
import authenticate from '../../middlewares/authenticate';
import resellerAdminMiddleware from '../../middlewares/resellerAdminAuthorization';

const router = express.Router();

router.post('/create-profile', authenticate, resellerAdminMiddleware, ResellerController.createReseller);

router.get('/profile/:email', ResellerController.getResellerByEmail); // 👈 New Route

router.get('/rating/:email', ResellerController.getResellerRating);

router.get('/slug/:slug', ResellerController.getResellerBySlug);

export const ResellerRoutes = router;
