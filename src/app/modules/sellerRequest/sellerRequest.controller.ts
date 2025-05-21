import { Request, Response } from 'express';
import {
	createSellerRequest,
	approveSellerRequest,
	rejectSellerRequest,
	getSellerRequests,
	getSellerRequestsByUser,
} from './sellerRequest.service';

// Create a seller request
export const handleCreateSellerRequest = async (req: Request, res: Response) => {
	const { productType, additionalInfo, phone, email } = req.body; // Include phone in request body
	const userId = req.user._id; // Assuming user ID is attached to req.user by authentication middleware

	try {
		const request = await createSellerRequest(userId, productType, additionalInfo, phone, email);
		res.status(201).json({
			success: true,
			message: 'Seller request created successfully',
			data: request,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Approve a seller request
export const handleApproveSellerRequest = async (req: Request, res: Response) => {
	const { requestId } = req.params; // Fetch requestId from the route parameters

	try {
		const request = await approveSellerRequest(requestId);
		res.status(200).json({ success: true, message: 'Seller request approved successfully', data: request });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Reject a seller request
export const handleRejectSellerRequest = async (req: Request, res: Response) => {
	const { requestId } = req.params; // Fetch requestId from the route parameters

	try {
		const request = await rejectSellerRequest(requestId);
		res.status(200).json({ success: true, message: 'Seller request rejected successfully', data: request });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Fetch all seller requests (Admin only)
export const handleGetSellerRequests = async (req: Request, res: Response) => {
	try {
		const requests = await getSellerRequests();
		res.status(200).json({ success: true, data: requests });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Fetch all seller requests of the logged-in user
export const handleGetOwnSellerRequests = async (req: Request, res: Response) => {
	const userId = req.user._id; // Fetch userId from the request object (set by the auth middleware)

	try {
		const requests = await getSellerRequestsByUser(userId);
		res.status(200).json({ success: true, data: requests });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};
