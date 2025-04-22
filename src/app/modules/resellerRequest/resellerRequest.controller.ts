import { Request, Response } from 'express';
import {
	createResellerRequest,
	approveResellerRequest,
	rejectResellerRequest,
	getResellerRequests,
	getResellerRequestsByUser,
} from './resellerRequest.service';

// Create a reseller request
export const handleCreateResellerRequest = async (req: Request, res: Response) => {
	const { productType, additionalInfo, phone, email } = req.body; // Include phone in request body
	const userId = req.user._id; // Assuming user ID is attached to req.user by authentication middleware

	try {
		const request = await createResellerRequest(userId, productType, additionalInfo, phone, email);
		res.status(201).json({
			success: true,
			message: 'Reseller request created successfully',
			data: request,
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Approve a reseller request
export const handleApproveResellerRequest = async (req: Request, res: Response) => {
	const { requestId } = req.params; // Fetch requestId from the route parameters

	try {
		const request = await approveResellerRequest(requestId);
		res.status(200).json({ success: true, message: 'Reseller request approved successfully', data: request });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Reject a reseller request
export const handleRejectResellerRequest = async (req: Request, res: Response) => {
	const { requestId } = req.params; // Fetch requestId from the route parameters

	try {
		const request = await rejectResellerRequest(requestId);
		res.status(200).json({ success: true, message: 'Reseller request rejected successfully', data: request });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// Fetch all reseller requests (Admin only)
export const handleGetResellerRequests = async (req: Request, res: Response) => {
	try {
		const requests = await getResellerRequests();
		res.status(200).json({ success: true, data: requests });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Fetch all reseller requests of the logged-in user
export const handleGetOwnResellerRequests = async (req: Request, res: Response) => {
	const userId = req.user._id; // Fetch userId from the request object (set by the auth middleware)

	try {
		const requests = await getResellerRequestsByUser(userId);
		res.status(200).json({ success: true, data: requests });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		res.status(500).json({ success: false, message: error.message });
	}
};
