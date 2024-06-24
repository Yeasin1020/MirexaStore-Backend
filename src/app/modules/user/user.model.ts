import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import bcryptjs from "bcryptjs";
import config from '../../config';

// Define the type for Role


// Create a Mongoose schema for the User interface
const userSchema = new Schema<TUser>({
	name: {
		type: String,
		required: [true, 'Name is required'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		select: false
	},
	phone: {
		type: String,
		required: [true, 'Phone number is required'],
		trim: true,
	},
	address: {
		type: String,
		required: [true, 'Address is required'],
		trim: true,
	},
	role: {
		type: String,
		required: [true, 'Role is required'],
		enum: ['admin', 'user'],
	},
	profile: {
		type: Schema.Types.ObjectId,
		ref: 'Profile' // Assuming a Profile model exists
	}
}, {
	timestamps: true,
	toJSON: {
		transform(doc, ret) {
			delete ret.password; // Remove password field from the response
			return ret;
		}
	}
});

userSchema.pre('save', async function (next) {
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const user = this;

	user.password = await bcryptjs.hash(user.password, Number(config.bcrypt_salt_rounds))

	next()
})

// Create and export the User model
const User = model<TUser>('User', userSchema);

export default User;
