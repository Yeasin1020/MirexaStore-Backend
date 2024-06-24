
import config from "../../config";
import { TUser } from "../user/user.interface";
import User from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { isPasswordMatched } from "./auth.util";
import jwt from "jsonwebtoken"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signup = async (payload: TUser): Promise<any> => {
	const user = await User.findOne({ email: payload.email });
	if (user) {
		throw new Error("User already exist");
	}

	const newUser = await User.create(payload);
	return newUser
}


const login = async (payload: TLoginUser) => {
	const user = await User.findOne({ email: payload.email }).select("+password");

	if (!user) {
		console.error('User not found');
		throw new Error("User not found");
	}

	const passwordMatch = await isPasswordMatched(payload.password, user.password);

	if (!passwordMatch) {
		console.error('Password not matched');
		throw new Error("Password not matched");
	}

	const jwtPayload = {
		_id: user._id,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
		expiresIn: config.jwt_access_expires_in,
	});

	const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret as string, {
		expiresIn: config.jwt_refresh_expires_in,
	});

	const fullUser = await User.findById(user._id).select('-password');
	return {
		accessToken,
		refreshToken,
		user: fullUser
	};
};

export const AuthServices = {
	signup,
	login,
};