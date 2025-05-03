import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import config from './app/config'; // Assuming your config file contains sensitive info
import './app/config/passport'; // ✅ Make sure Google Strategy is initialized here

const app: Application = express();

// CORS Configuration
const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));
// Body parser
app.use(express.json());

// Session Configuration
app.use(
  session({
    secret: config.session_secret || 'your-fallback-secret', // Use a strong session secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.NODE_ENV === 'production', // Cookies should be secure in production (HTTPS)
      httpOnly: true, // Prevent client-side JS access
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// Passport Middleware
app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Use Passport session to store user info

// Routes
app.use('/api', router);

// Home route for checking if the server is up
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Deployment successful!');
});

// Error Handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
