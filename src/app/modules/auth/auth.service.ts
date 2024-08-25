

import httpStatus from 'http-status';

import { TLoginUser } from './auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signup = async (payload: TUser): Promise<any> => {
	const user = await User.findOne({ email: payload.email });

	if (user) {
		throw new AppError(httpStatus.CONFLICT, 'User already exists');
	}

	const newUser = await User.create(payload);
	return newUser;
};

const login = async (payload: TLoginUser) => {
	const user = await User.findOne({ email: payload.email }).select('+password');

	if (!user) {
		throw new AppError(httpStatus.CONFLICT, 'User not found');
	}

	const isPasswordMatched = async (
		inputPassword: string,
		hashedPassword: string,
	): Promise<boolean> => {
		const isMatched = await bcrypt.compare(inputPassword, hashedPassword);
		return isMatched;
	};

	if (!(await isPasswordMatched(payload.password, user.password))) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'Password not matched');
	}

	const jwtPayload = {
		email: user.email,
		role: user.role,
	};
	const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
		expiresIn: config.jwt_access_expires_in,
	});

	const refreshToken = jwt.sign(
		jwtPayload,
		config.jwt_access_secret as string,
		{
			expiresIn: config.jwt_access_expires_in,
		},
	);

	return {
		accessToken,
		refreshToken,
		user,
	};
};

export const AuthServices = {
	signup,
	login,
};