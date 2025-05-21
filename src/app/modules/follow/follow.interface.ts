import { Types } from 'mongoose';

export interface IFollow {
	user: Types.ObjectId;       // Refers to User
	seller: Types.ObjectId;   // Refers to seller
	createdAt?: Date;
	updatedAt?: Date;
}
