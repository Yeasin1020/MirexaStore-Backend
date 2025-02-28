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
