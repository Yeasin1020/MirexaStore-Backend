
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { UserServices } from "./user.services";
import sendResponse from "../../utils/sendResponse";

const getProfile = catchAsync(async (req, res) => {
	// User data পেতে service function কল করছি
	const user = await UserServices.getProfile(req.user._id);

	if (!user) {
		// যদি user না থাকে, তাহলে 404 return
		return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
	}

	// সঠিক ভাবে user data send করছি response এর মাধ্যমে
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile retrieved successfully",
		data: user,
	});
});

const getUserById = catchAsync(async (req, res) => {
	const { id } = req.params;
	const user = await UserServices.getProfile(id); // You can reuse the getProfile service function to get a user by ID
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User retrieved successfully",
		data: user,
	});
});


const getAllUsers = catchAsync(async (req, res) => {
	const users = await UserServices.getAllUsers();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "All users retrieved successfully",
		data: users,
	});
});

const deleteUser = catchAsync(async (req, res) => {
	const { id } = req.params;
	await UserServices.deleteUser(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User deleted successfully",
		data: undefined
	});
});

const makeAdmin = catchAsync(async (req, res) => {
	const { id } = req.params;
	const updatedUser = await UserServices.makeAdmin(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User role updated to admin",
		data: updatedUser,
	});
});

const makeseller = catchAsync(async (req, res) => {
	const { id } = req.params;
	const updatedUser = await UserServices.makeseller(id);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User role updated to seller",
		data: updatedUser,
	});
});

export const UserControllers = { getAllUsers, deleteUser, makeAdmin, getProfile, getUserById, makeseller };