// middleware/resellerMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const resellerAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const role = req.user?.role;

	if (role !== 'reseller' && role !== 'admin') {
		// Admin keo access pabe jodi chai
		return res.status(403).json({ message: 'Access forbidden: Resellers only/admin only' });
	}
	next();
};

export default resellerAdminMiddleware;
