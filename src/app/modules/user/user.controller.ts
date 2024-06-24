import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.services";



const createUsers = catchAsync(async (req, res) => {
	const newUser = await UserServices.createUsersIntoDB(req.body)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User registered successfully',
		data: newUser,
	});
})

export const UserControllers = {
	createUsers
};