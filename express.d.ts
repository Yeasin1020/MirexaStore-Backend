// types/express.d.ts
import { TUser } from './path/to/user.interface';

declare module 'express-serve-static-core' {
	interface Request {
		user?: TUser;
	}
}
