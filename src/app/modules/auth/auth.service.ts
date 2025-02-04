/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { isPasswordMatched } from './auth.util';

// Google login logic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleLogin = async (googleProfile: any) => {
	try {
		// Check if the user already exists in the database
		const existingUser = await User.findOne({ email: googleProfile.email });

		if (existingUser) {
			return {
				user: existingUser,
				accessToken: generateAccessToken(existingUser),
				refreshToken: generateRefreshToken(existingUser),
			};
		}

		// If the user doesn't exist, create a new user
		const newUser = await User.create({
			name: googleProfile.name,
			email: googleProfile.email,
			phone: googleProfile.phone || "",
			address: googleProfile.address || "",
			role: "user", // Default role
			googleId: googleProfile.id,
		});

		return {
			user: newUser,
			accessToken: generateAccessToken(newUser),
			refreshToken: generateRefreshToken(newUser),
		};
	} catch (error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Google login failed');
	}
};

// Helper function to generate tokens
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateAccessToken = (user: any) => {
	const jwtPayload = {
		email: user.email,
		role: user.role,
	};
	return jwt.sign(jwtPayload, config.jwt_access_secret, {
		expiresIn: config.jwt_access_expires_in,
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateRefreshToken = (user: any) => {
	const jwtPayload = {
		email: user.email,
		role: user.role,
	};
	return jwt.sign(jwtPayload, config.jwt_refresh_secret, {
		expiresIn: config.jwt_refresh_expires_in,
	});
};

// Signup logic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signup = async (payload: TUser): Promise<any> => {
	const user = await User.findOne({ email: payload.email });

	if (user) {
		throw new AppError(httpStatus.CONFLICT, 'User already exists');
	}

	const newUser = await User.create(payload);
	return newUser;
};

// Login logic
const login = async (payload: TLoginUser) => {
	const user = await User.findOne({ email: payload.email }).select('+password');

	if (!user) {
		throw new AppError(httpStatus.CONFLICT, 'User not found');
	}

	if (!(await isPasswordMatched(payload.password, user.password))) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'Password not matched');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const jwtPayload = {
		email: user.email,
		role: user.role,
	};

	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);

	return {
		accessToken,
		refreshToken,
		user,
	};
};

export const AuthServices = {
	signup,
	login,
	googleLogin,
};
