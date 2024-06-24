import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../modules/user/user.model';
import config from '../config';

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'No token provided' });
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const decoded: any = jwt.verify(token, config.jwt_access_secret as string);

		const user = await User.findById(decoded._id).select('-password');
		if (!user) {
			return res.status(401).json({ message: 'Invalid token' });
		}

		req.user = user; // Attach user to the request object
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
};

export default authenticate;