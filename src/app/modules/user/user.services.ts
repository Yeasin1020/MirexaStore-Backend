import { TUser } from "./user.interface";
import User from "./user.model";

const createUsersIntoDB = async (payload: TUser) => {
	const admin = await User.create(payload);
	return admin
}


export const UserServices = {
	createUsersIntoDB
}