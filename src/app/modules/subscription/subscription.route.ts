import express from 'express';
import { SubscriptionController } from './subscription.controller';
import authenticate from '../../middlewares/authenticate';
import adminMiddleware from '../../middlewares/adminAuthorization';
import sellerAdminMiddleware from '../../middlewares/sellerAdminAuthorization';

const router = express.Router();

// Public or seller authenticated
router.get('/plans', SubscriptionController.getPlans);

// Seller route
router.post('/request', authenticate, sellerAdminMiddleware, SubscriptionController.submitRequest);
// Seller: Get own subscription requests
router.get('/my-requests', authenticate, sellerAdminMiddleware, SubscriptionController.getRequestsBySeller);

// Admin routes
router.post('/plans', authenticate, adminMiddleware, SubscriptionController.createPlan);
router.get('/pending', authenticate, adminMiddleware, SubscriptionController.getPending);
router.patch('/approve/:id', authenticate, adminMiddleware, SubscriptionController.approveRequest);
router.patch('/reject/:id', authenticate, adminMiddleware, SubscriptionController.rejectRequest);

export const SubscriptionRoutes = router;
