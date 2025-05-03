import { USER_ROLE } from "./user.constants";
import { TUser } from "./user.interface";
import { User } from "./user.model";


export const getProfile = async (userId: string) => {
	return await User.findById(userId).select("-password").lean(); // lean() for performance
};

export const getAllUsers = async () => {
	return await User.find().select("-password");
};

export const deleteUser = async (userId: string) => {
	const deletedUser = await User.findByIdAndDelete(userId);
	if (!deletedUser) throw new Error("User not found");
	return deletedUser;
};

export const makeAdmin = async (userId: string) => {
	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ role: USER_ROLE.admin },
		{ new: true }
	).select("-password");

	if (!updatedUser) throw new Error("User not found");
	return updatedUser;
};
export const makeReseller = async (userId: string) => {
	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ role: USER_ROLE.reseller },
		{ new: true }
	).select("-password");

	if (!updatedUser) throw new Error("User not found");
	return updatedUser;
};

export const updateProfile = async (userId: string, updateData: Partial<TUser>) => {
	const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
	if (!updatedUser) throw new Error("User not found");
	return updatedUser;
};

export const UserServices = { getAllUsers, deleteUser, makeAdmin, updateProfile, getProfile, makeReseller };