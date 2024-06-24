// middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (req.user?.role !== 'admin') {
		return res.status(403).json({ message: 'Access forbidden: Admins only' });
	}
	next();
};

export default adminMiddleware;
