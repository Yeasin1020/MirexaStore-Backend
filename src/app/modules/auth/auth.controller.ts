import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../config";
import passport from "passport";


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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleLogin = (req: any, res: any, next: any) => {
	passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleCallback = async (req: any, res: any) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	passport.authenticate("google", { failureRedirect: "/login" }, (err: any, user: any) => {
		if (err || !user) {
			return res.status(httpStatus.UNAUTHORIZED).json({ message: "Google login failed" });
		}
		const { accessToken, refreshToken, user: userData } = user;
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: config.NODE_ENV === "production",
		});
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "User logged in with Google successfully",
			token: accessToken,
			data: userData,
		});
	})(req, res);
};



export const AuthControllers = {
	signup,
	login,
	googleLogin,
	googleCallback,
};