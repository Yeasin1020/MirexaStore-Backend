import express from 'express';
import { handleCreateResellerRequest, handleApproveResellerRequest, handleRejectResellerRequest, handleGetResellerRequests, handleGetOwnResellerRequests } from './resellerRequest.controller';
import adminMiddleware from '../../middlewares/adminAuthorization';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

// Route to create a reseller request
router.post('/create', authenticate, handleCreateResellerRequest);
// route/resellerRequest.route.ts
router.get('/my-requests', authenticate, handleGetOwnResellerRequests);

// Admin routes to approve, reject, and fetch reseller requests
router.put('/approve/:requestId', authenticate, adminMiddleware, handleApproveResellerRequest);
router.put('/reject/:requestId', authenticate, adminMiddleware, handleRejectResellerRequest);
router.get('/all', authenticate, adminMiddleware, handleGetResellerRequests);

export const RoutesForReseller = router;
