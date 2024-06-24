import { z } from 'zod';

const createUsersValidationSchema = z.object({
	body: z.object({
		name: z.string({
			required_error: 'Name is required',
		}).trim(),

		email: z.string({
			required_error: 'Email is required',
		}).email().trim().toLowerCase(),

		password: z.string({
			required_error: 'Password is required',
		}),

		phone: z.string({
			required_error: 'Phone number is required',
		}).trim(),

		address: z.string({
			required_error: 'Address is required',
		}).trim(),

		role: z.enum(['admin', 'user'], {
			required_error: 'Role is required',
		}),
	})
});

export default createUsersValidationSchema;

