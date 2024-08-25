import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";


const signup = catchAsync(async (req, res) => {
	const newUser = await AuthServices.signup(req.body)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User registered successfully',
		data: newUser,
	});
})
const login = catchAsync(async (req, res) => {
	const { accessToken, refreshToken, user } = await AuthServices.login(req.body);

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: config.NODE_ENV === 'production',
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User logged in successfully',
		token: accessToken,
		data: user,
	});
});

export const AuthControllers = {
	signup,
	login
};