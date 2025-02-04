import express from 'express';
import passport from 'passport';
import { AuthControllers } from './auth.controller';  // Importing controller for signup and login
const router = express.Router();

// Route for registering a user
router.post('/register', AuthControllers.signup);

// Route for logging in a user
router.post('/login', AuthControllers.login);

// Google OAuth route to start the authentication process
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/login', // Redirect here in case of failure
	}),
	(req, res) => {
		// Success: Redirect to the dashboard or home page
		res.redirect('/dashboard');
	}
);

export const AuthRoutes = router;
