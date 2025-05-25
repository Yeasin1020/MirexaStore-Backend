// ✅ Updated seller Controller (seller.controller.ts)
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SellerService, SellerServices } from './seller.service';

// 🔨 Create Seller Profile (only for users with role: 'seller')
export const createSellerProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user._id;
	const data = req.body;

	const result = await SellerService.createProfile(userId, data);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: '✅ Seller profile created successfully',
		data: result,
	});
});

// 📩 Get Seller Profile by Email
export const getSellerByEmail = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.params;

	const result = await SellerService.getSellerByEmail(email);

	if (!result) {
		return sendResponse(res, {
			statusCode: httpStatus.NOT_FOUND,
			success: false,
			message: '❌ Seller not found with this email',
			data: null,
		});
	}

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: '✅ Seller profile retrieved successfully',
		data: result,
	});
});

// 🛠 Admin: Extend Seller Validity
export const extendSellerValidity = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.params;
	const { extraDays } = req.body;

	// Validation
	if (!extraDays || typeof extraDays !== 'number' || extraDays <= 0) {
		throw new Error('❌ Please provide a valid positive number for extraDays');
	}

	const result = await SellerService.extendSellerValidity(email, extraDays);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `✅ Seller validity extended by ${extraDays} day(s)`,
		data: result,
	});
});
export const getAllSellers = async (req: Request, res: Response) => {
	try {
		const sellers = await SellerService.getAllSellers();
		res.status(200).json({
			success: true,
			message: 'All sellers fetched successfully',
			data: sellers,
		});
	} catch (error) {
		console.error('Error fetching all sellers:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch sellers',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};


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
	createSellerProfile,
	getSellerByEmail,
	extendSellerValidity,
	getSellerRating,
	getSellerBySlug,
	getAllSellers
};