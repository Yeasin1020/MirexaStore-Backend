import { z } from 'zod';
import { USER_ROLE } from './user.constants';

const UserValidationSchema = z.object({
	body: z.object({
		name: z.string().min(1, { message: 'Name is required' }).trim(),
		email: z.string().email({ message: 'Invalid email address' }).trim(),
		password: z.string().min(1, { message: 'Password is required' }).trim(),
		phone: z.string().min(1, { message: 'Phone number is required' }).trim(),
		address: z.string().trim().optional(),
		role: z.nativeEnum(USER_ROLE, {
			message: "Role must be either 'admin' or 'user'",
		}),
	}),
});

export const UserValidation = {
	UserValidationSchema,
};
