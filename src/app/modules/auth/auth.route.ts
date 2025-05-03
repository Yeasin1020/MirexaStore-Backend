import express from 'express';
import { AuthControllers } from './auth.controller'; // Importing controller for signup and login

const router = express.Router();

// Route for registering a user
router.post('/register', AuthControllers.signup);

// Route for logging in a user
router.post('/login', AuthControllers.login);

// Google OAuth route to start the authentication process
router.get('/google', AuthControllers.googleLogin);

// Google callback route
router.get('/google/callback', AuthControllers.googleCallback);

export const AuthRoutes = router;
