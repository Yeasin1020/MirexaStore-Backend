// ✅ Updated seller Controller (seller.controller.ts)
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SellerService, SellerServices } from './seller.service';

const createSeller = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user._id;
	const data = req.body;
	const result = await SellerService.createProfile(userId, data);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Seller profile created successfully',
		data: result,
	});
});

const getSellerByEmail = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.params;
	const result = await SellerService.getSellerByEmail(email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Seller profile retrieved successfully',
		data: result,
	});
});

export const getSellerRating = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.params;

	if (!email) {
		return res.status(400).json({ message: 'Email is required' });
	}

	const result = await SellerServices.getSellerRating(email);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Seller rating fetched successfully',
		data: result,
	});
});
const getSellerBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;

	if (!slug) {
		return res.status(400).json({ message: 'Slug is required' });
	}

	const result = await SellerServices.getSellerBySlug(slug);

	if (!result) {
		return res.status(404).json({ message: 'Seller not found' });
	}

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Seller profile fetched by slug successfully',
		data: result,
	});
});

export const SellerController = {
	createSeller,
	getSellerByEmail,
	getSellerRating,
	getSellerBySlug
};