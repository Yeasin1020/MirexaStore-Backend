import express from 'express';
import { AuthControllers } from './auth.controller';
const router = express.Router();

router.post(
	'/register',
	AuthControllers.signup
);

router.post(
	'/login',
	AuthControllers.login
);


export const AuthRoutes = router;