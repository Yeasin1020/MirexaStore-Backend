import { Types } from 'mongoose';

export interface IFollow {
	user: Types.ObjectId;       // Refers to User
	reseller: Types.ObjectId;   // Refers to Reseller
	createdAt?: Date;
	updatedAt?: Date;
}
