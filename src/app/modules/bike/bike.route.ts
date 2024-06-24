import express from 'express';
import authenticate from '../../middlewares/authenticate';
import adminMiddleware from '../../middlewares/adminAuthorization';
import { BikeController } from './bike.controller';
const router = express.Router();


router.post('/', authenticate, adminMiddleware, BikeController.createBike);
router.get('/', BikeController.getAllBikes);
router.put('/:id', authenticate, BikeController.updateBike);
router.delete('/:id', authenticate, BikeController.deleteBike);

export const BikeRoutes = router;