// middleware/sellerMiddleware.ts
import { Request, Response, NextFunction } from 'express';

const sellerAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const role = req.user?.role;

	if (role !== 'seller' && role !== 'admin') {
		// Admin keo access pabe jodi chai
		return res.status(403).json({ message: 'Access forbidden: sellers only/admin only' });
	}
	next();
};

export default sellerAdminMiddleware;
