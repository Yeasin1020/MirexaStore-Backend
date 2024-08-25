import express from 'express';

import authenticate from '../../middlewares/authenticate';
import { UserControllers } from './user.controller';

const router = express.Router();

router.get('/me', authenticate, UserControllers.getProfile);
router.put('/me', authenticate, UserControllers.updateUserProfile);


export const UserRoutes = router;