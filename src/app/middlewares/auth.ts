/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { USER_ROLE } from '../modules/user/user.constants';
import { User } from '../modules/user/user.model';

export const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.headers.authorization;

		if (!accessToken || !accessToken.startsWith('Bearer')) {
			return next(
				new AppError(
					httpStatus.UNAUTHORIZED,
					'You have no access to this route',
				),
			);
		}

		const token = accessToken.split(' ')[1];
		try {
			const verifiedToken = jwt.verify(
				token,
				config.jwt_access_secret as string,
			) as JwtPayload;

			const { role, email } = verifiedToken;
			const user = await User.findOne({ email });
			if (!user) {
				return next(new AppError(httpStatus.NOT_FOUND, 'User not found'));
			}

			if (!requiredRoles.includes(role as keyof typeof USER_ROLE)) {
				return res.status(httpStatus.FORBIDDEN).json({
					success: false,
					statusCode: httpStatus.UNAUTHORIZED,
					message: 'You have no access to this route',
				});
			}
			(req as any).user = user;
			next();
		} catch (err) {
			return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid token'));
		}
	});
};