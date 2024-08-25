
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

import config from '../../config';
import { USER_ROLE } from './user.constants';

// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const userSchema = new Schema<TUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		phone: { type: String, required: true },
		address: { type: String, required: true },
		role: { type: String, required: true, enum: Object.keys(USER_ROLE) },
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.__v;

				const orderedRet = {
					_id: doc._id,
					name: doc.name,
					email: doc.email,
					phone: doc.phone,
					role: doc.role,
					address: doc.address,
				};
				return orderedRet;
			},
		},
	},
);

//hashing password
userSchema.pre('save', async function (next) {
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const user = this;
	user.password = await bcrypt.hash(
		user.password,
		Number(config.bcrypt_salt_rounds),
	);
	next();
});

userSchema.post('save', async function (doc, next) {
	doc.password = '';
	next();
});

export const User = model<TUser>('User', userSchema);