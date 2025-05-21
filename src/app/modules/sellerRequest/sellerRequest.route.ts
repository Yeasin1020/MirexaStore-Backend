import express from 'express';
import { handleCreateSellerRequest, handleApproveSellerRequest, handleRejectSellerRequest, handleGetSellerRequests, handleGetOwnSellerRequests } from './sellerRequest.controller';
import adminMiddleware from '../../middlewares/adminAuthorization';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

// Route to create a seller request
router.post('/create', authenticate, handleCreateSellerRequest);
// route/sellerRequest.route.ts
router.get('/my-requests', authenticate, handleGetOwnSellerRequests);

// Admin routes to approve, reject, and fetch seller requests
router.put('/approve/:requestId', authenticate, adminMiddleware, handleApproveSellerRequest);
router.put('/reject/:requestId', authenticate, adminMiddleware, handleRejectSellerRequest);
router.get('/all', authenticate, adminMiddleware, handleGetSellerRequests);

export const RoutesForSeller = router;
