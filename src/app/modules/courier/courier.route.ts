import express from 'express';
import authenticate from '../../middlewares/authenticate';
import { getCourier, requestCourier } from './courier.controller';

const router = express.Router();

router.post('/request', authenticate, requestCourier);
router.get('/:orderId', authenticate, getCourier);

export const CourierRoutes = router;
