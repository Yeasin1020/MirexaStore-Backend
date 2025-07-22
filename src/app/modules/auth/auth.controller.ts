import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import passport from "passport";
import { Request, Response, NextFunction } from "express";

// Signup Controller
const signup = catchAsync(async (req: Request, res: Response) => {
	const newUser = await AuthServices.signup(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User registered successfully",
		data: newUser,
	});
});

// Login Controller
const login = catchAsync(async (req: Request, res: Response) => {
	const { accessToken, refreshToken, user } = await AuthServices.login(req.body);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User logged in successfully",
		token: accessToken,
		data: user,
	});
});

// Google OAuth Start
const googleLogin = (req: Request, res: Response, next: NextFunction) => {
	const redirectPath = req.query.redirect || "/";
	passport.authenticate("google", {
		scope: ["profile", "email"],
		state: JSON.stringify({ redirect: redirectPath }), // State theke pass
	})(req, res, next);
};

// Handles the Google OAuth callback
const googleCallback = (req: Request, res: Response) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	passport.authenticate("google", { failureRedirect: "/login" }, async (err: any, user: any) => {
		if (err) {

			return res.status(500).json({ message: "Internal server error", error: err });
		}

		if (!user) {

			return res.status(401).json({ message: "Google login failed, no user found" });
		}

		// Extract redirectPath from state (already decoded)
		let redirectPath = "/";
		try {
			const state = req.query.state ? JSON.parse(String(req.query.state)) : {};
			if (state.redirect) {
				redirectPath = state.redirect;
			}
		} catch (e) {
			console.warn("Failed to parse redirect state:", e);
		}

		try {

			const { accessToken, refreshToken } = await AuthServices.googleLogin(user);


			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});

			// ⚠️ Don't encode again — already encoded by frontend
			const redirectURL = `https://www.mirexastore.com/login?token=${accessToken}&redirect=${redirectPath}`;
			res.redirect(redirectURL);
		} catch (serviceError) {
			console.error("Error during Google login service:", serviceError);
			return res.status(500).json({
				message: "Failed to process Google login",
				error: serviceError,
			});
		}
	})(req, res);
};



export const AuthControllers = {
	signup,
	login,
	googleLogin,
	googleCallback,
};
