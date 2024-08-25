import { TUser } from "./user.interface";
import { User } from "./user.model";


export const updateProfile = async (userId: string, updateData: Partial<TUser>) => {
	const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
	if (!updatedUser) {
		throw new Error('User not found');
	}
	return updatedUser;
};

export const UserServices = {
	updateProfile
}