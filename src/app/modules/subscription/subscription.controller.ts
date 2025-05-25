import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';

// Get all subscription plans
const getPlans = catchAsync(async (_req: Request, res: Response) => {
	const result = await SubscriptionService.getAllPlans();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Subscription plans retrieved successfully',
		data: result,
	});
});

// subscription.controller.ts
const createPlan = catchAsync(async (req: Request, res: Response) => {
	const result = await SubscriptionService.createPlan(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Subscription plan created successfully',
		data: result,
	});
});

// Submit subscription request
const submitRequest = catchAsync(async (req: Request, res: Response) => {
	const sellerEmail = req.user.email;
	const sellerName = req.user.name;
	const result = await SubscriptionService.createRequest({ ...req.body, sellerEmail, sellerName });

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Subscription request submitted successfully',
		data: result,
	});
});

const getRequestsBySeller = catchAsync(async (req: Request, res: Response) => {
	const email = req.user.email;
	const result = await SubscriptionService.getRequestsBySeller(email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Subscription requests retrieved for seller',
		data: result,
	});
});

// Admin: Get all pending requests
const getPending = catchAsync(async (_req: Request, res: Response) => {
	const result = await SubscriptionService.getPendingRequests();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Pending subscription requests fetched',
		data: result,
	});
});

// Admin: Approve request
const approveRequest = catchAsync(async (req: Request, res: Response) => {
	const result = await SubscriptionService.approveRequest(req.params.id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Subscription approved and seller validity extended',
		data: result,
	});
});

// Admin: Reject request
const rejectRequest = catchAsync(async (req: Request, res: Response) => {
	const result = await SubscriptionService.rejectRequest(req.params.id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Subscription request rejected',
		data: result,
	});
});

export const SubscriptionController = {
	getPlans,
	createPlan,
	submitRequest,
	getRequestsBySeller,
	getPending,
	approveRequest,
	rejectRequest,
};
