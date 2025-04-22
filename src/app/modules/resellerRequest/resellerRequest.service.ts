import { ResellerRequest } from './resellerRequest.model';

// Create a reseller request
export const createResellerRequest = async (
	userId: string,
	productType: string,
	additionalInfo: string,
	phone: string,
	email: string
) => {
	// Check if the user already has a pending request
	const existingRequest = await ResellerRequest.findOne({
		user: userId,
		status: 'pending',
	});

	if (existingRequest) throw new Error('You have already made a reseller request.');

	// Create a new reseller request
	const newRequest = new ResellerRequest({
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

// Approve a reseller request
export const approveResellerRequest = async (requestId: string) => {
	const request = await ResellerRequest.findById(requestId);
	if (!request) throw new Error('Request not found.');

	if (request.status !== 'pending') throw new Error('Request is not pending.');

	// Change the request status to approved
	request.status = 'approved';
	await request.save();
	return request;
};

// Reject a reseller request
export const rejectResellerRequest = async (requestId: string) => {
	const request = await ResellerRequest.findById(requestId);
	if (!request) throw new Error('Request not found.');

	if (request.status !== 'pending') throw new Error('Request is not pending.');

	// Change the request status to rejected
	request.status = 'rejected';
	await request.save();
	return request;
};

// Fetch all reseller requests (for admin)
export const getResellerRequests = async () => {
	return await ResellerRequest.find().populate('user', 'name email'); // Populate user details (name, email)
};

// Fetch reseller requests for a specific user
export const getResellerRequestsByUser = async (userId: string) => {
	return await ResellerRequest.find({ user: userId }).sort({ createdAt: -1 });
};
