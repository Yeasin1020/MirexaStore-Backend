import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import createUsersValidationSchema from './user.validation';

const router = express.Router();

router.post(
	'/signups',
	validateRequest(createUsersValidationSchema),
	UserControllers.createUsers
);


export const UserRoutes = router;