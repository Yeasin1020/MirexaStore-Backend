import cors, { CorsOptions } from 'cors';
import express, { Application, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import config from './app/config'; // Your sensitive config
import './app/config/passport'; // Google Strategy

const app: Application = express();

// Allowed frontend origins
const allowedOrigins = [
  'https://mirexastore.com',
  'https://www.mirexastore.com',
  'https://api.mirexastore.com',
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: config.session_secret || 'your-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.NODE_ENV === 'production', // HTTPS only
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'none', // ✅ required for cross-origin cookies
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', router);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Deployment Successfully Done!');
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
