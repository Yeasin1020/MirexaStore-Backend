// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { AuthServices } from '../modules/auth/auth.service';
// import config from '.';

// // Google OAuth Strategy
// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: config.google_client_id,
// 			clientSecret: config.google_client_secret,
// 			callbackURL: config.google_callback_url,
// 		},
// 		async (accessToken, refreshToken, profile, done) => {
// 			try {
// 				const { user, accessToken, refreshToken } = await AuthServices.googleLogin(profile._json);
// 				return done(null, { user, accessToken, refreshToken });
// 			} catch (error) {
// 				return done(error, null);
// 			}
// 		}
// 	)
// );

// // Serialize and deserialize user
// passport.serializeUser((user, done) => {
// 	done(null, user);
// });

// passport.deserializeUser((user, done) => {
// 	done(null, user);
// });

// export default passport;
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import config from '../config/index'; // Correctly imported config
import { User } from '../modules/user/user.model'; // Assuming User model is set up correctly

// The profile is of type Profile (already defined in passport-google-oauth20)
passport.use(new GoogleStrategy(
	{
		clientID: config.google_client_id,
		clientSecret: config.google_client_secret,
		callbackURL: config.google_callback_url, // Make sure this matches what you registered in Google Console
		passReqToCallback: true, // Allow access to the request object
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
	async (req: any, token: string, tokenSecret: string, profile: Profile, done: (error: any, user: any) => void) => {
		try {
			const email = profile.emails?.[0]?.value;

			if (!email) {
				return done(new Error('No email found in Google profile'), null);
			}

			const existingUser = await User.findOne({ email });

			if (existingUser) {
				// User already exists, pass the existing user to Passport session
				return done(null, existingUser);
			}

			// If the user doesn't exist, create a new one
			const newUser = await User.create({
				name: profile.displayName,
				email,
				googleId: profile.id,
				role: 'user', // You can adjust this as needed
			});

			return done(null, newUser);
		} catch (error) {
			return done(error, null); // Pass any error to the done callback
		}
	}
));

export default passport; // Ensure you export the passport setup
