import { SellerRequest } from './sellerRequest.model';

// Create a seller request
export const createSellerRequest = async (
	userId: string,
	productType: string,
	additionalInfo: string,
	phone: string,
	email: string
) => {
	// Check if the user already has a pending request
	const existingRequest = await SellerRequest.findOne({
		user: userId,
		status: 'pending',
	});

	if (existingRequest) throw new Error('You have already made a seller request.');

	// Create a new seller request
	const newRequest = new SellerRequest({
		user: userId,
		productType,
		additionalInfo,
		phone,
		email,
		status: 'pending',
	});

	// Save the new request
	return await newRequest.save();
};

// Approve a seller request
export const approveSellerRequest = async (requestId: string) => {
	const request = await SellerRequest.findById(requestId);
	if (!request) throw new Error('Request not found.');

	if (request.status !== 'pending') throw new Error('Request is not pending.');

	// Change the request status to approved
	request.status = 'approved';
	await request.save();
	return request;
};

// Reject a seller request
export const rejectSellerRequest = async (requestId: string) => {
	const request = await SellerRequest.findById(requestId);
	if (!request) throw new Error('Request not found.');

	if (request.status !== 'pending') throw new Error('Request is not pending.');

	// Change the request status to rejected
	request.status = 'rejected';
	await request.save();
	return request;
};

// Fetch all seller requests (for admin)
export const getSellerRequests = async () => {
	return await SellerRequest.find()
		.sort({ createdAt: -1 }) // ✅ Sort by newest first
		.populate('user', 'name email');
};


// Fetch seller requests for a specific user
export const getSellerRequestsByUser = async (userId: string) => {
	return await SellerRequest.find({ user: userId }).sort({ createdAt: -1 });
};
