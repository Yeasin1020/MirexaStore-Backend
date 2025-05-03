import { Document, Types } from 'mongoose';

export interface TReply {
	_id?: Types.ObjectId | undefined;
	userId: Types.ObjectId;
	comment: string;
	userName: string;
	timestamp: Date;
}

// New media type definition
export interface TMedia {
	url: string;
	type: 'image' | 'video';
}

export interface TReview extends Document {
	_id: Types.ObjectId;
	productId: Types.ObjectId;
	userId: Types.ObjectId;
	userName: string;
	rating: number;
	comment: string;
	likes: Types.ObjectId[];
	replies: TReply[];
	media?: TMedia[]; // Optional media field
	createdAt: Date;
	updatedAt: Date;
}
