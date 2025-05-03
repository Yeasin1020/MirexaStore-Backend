// model.js
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import { USER_ROLE } from './user.constants';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: false, select: false },  // Password is optional for Google users
		phone: { type: String, required: function () { return !this.googleId; } },  // Only require phone for non-Google users
		address: { type: String },
		role: { type: String, required: true, enum: Object.keys(USER_ROLE) },
		googleId: { type: String, unique: true, sparse: true }, // Optional field for Google login users
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.__v;

				// Ordered return object
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
	}
);

// Hashing password before saving the user (for regular users, not Google login)
userSchema.pre('save', async function (next) {
	if (this.isModified('password') && this.password) {
		this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
	}
	next();
});

// Remove password after save
userSchema.post('save', function (doc, next) {
	doc.password = '';  // Remove password field after saving to the database
	next();
});

export const User = model<TUser>('User', userSchema);
