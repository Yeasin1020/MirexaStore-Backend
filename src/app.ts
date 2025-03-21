import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import config from './app/config'; // Assuming your config file contains sensitive info

const app: Application = express();

// Parsers
app.use(express.json()); // Parse incoming JSON payloads

// CORS configuration
const corsOptions = {
  origin: '*', // সকল ডোমেইনকে অনুমতি দেওয়া হচ্ছে
  credentials: true, // কুকি এবং হেডার পাঠানোর অনুমতি
};

app.use(cors(corsOptions)); // CORS middleware ব্যবহার করা হচ্ছে

// Session configuration for Passport.js
app.use(
  session({
    secret: config.google_client_secret || 'your-session-secret', // Ensure your session secret is set securely
    resave: false, // Do not resave sessions if nothing has changed
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: {
      secure: config.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 1000, // Set cookie expiration time to 1 hour
    },
  })
);

// Passport initialization
app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Use Passport session to store user info

// Application routes
app.use('/api', router); // All API routes start with '/api'

// Home route
app.get("/", (req: Request, res: Response) => {
  res.send("Deployment successfully done");
});

// Global error handler middleware
app.use(globalErrorHandler);

// Not Found handler
app.use(notFound);

export default app;
