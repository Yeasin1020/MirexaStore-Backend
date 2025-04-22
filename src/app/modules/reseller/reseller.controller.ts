// ✅ Updated Reseller Controller (reseller.controller.ts)
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ResellerService, ResellerServices } from './reseller.service';

const createReseller = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user._id;
	const data = req.body;
	const result = await ResellerService.createProfile(userId, data);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Reseller profile created successfully',
		data: result,
	});
});

const getResellerByEmail = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.params;
	const result = await ResellerService.getResellerByEmail(email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reseller profile retrieved successfully',
		data: result,
	});
});

export const getResellerRating = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.params;

	if (!email) {
		return res.status(400).json({ message: 'Email is required' });
	}

	const result = await ResellerServices.getResellerRating(email);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reseller rating fetched successfully',
		data: result,
	});
});
const getResellerBySlug = catchAsync(async (req: Request, res: Response) => {
	const { slug } = req.params;

	if (!slug) {
		return res.status(400).json({ message: 'Slug is required' });
	}

	const result = await ResellerServices.getResellerBySlug(slug);

	if (!result) {
		return res.status(404).json({ message: 'Reseller not found' });
	}

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Reseller profile fetched by slug successfully',
		data: result,
	});
});

export const ResellerController = {
	createReseller,
	getResellerByEmail,
	getResellerRating,
	getResellerBySlug
};