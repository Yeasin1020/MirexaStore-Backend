import express from 'express';
import authenticate from '../../middlewares/authenticate';
import { RentalController } from './rental.controller';
import adminMiddleware from '../../middlewares/adminAuthorization';
const router = express.Router();

router.post('/', authenticate, RentalController.createRental);
router.put('/:id/return', authenticate, adminMiddleware, RentalController.returnBike);


export const RentalRoutes = router;