import { Types } from "mongoose";


export type TRole = 'admin' | 'user';

export interface TUser {
	name: string;
	email: string;
	password: string;
	phone: string;
	address: string;
	role: TRole;
	profile?: Types.ObjectId;
}

