import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";


const getProfile = catchAsync(async (req, res) => {
	const user = req.user;

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User profile retrieved successfully',
		data: user,
	});
});


const updateUserProfile = catchAsync(async (req, res) => {
	const userId = req.user.id; // Extract user ID from the authenticated user
	const updatedUser = await UserServices.updateProfile(userId, req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Profile updated successfully',
		data: updatedUser,
	});
});


export const UserControllers = {
	getProfile,
	updateUserProfile
};