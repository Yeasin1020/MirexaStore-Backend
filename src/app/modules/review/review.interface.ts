import { Document, Types } from 'mongoose';

export interface TReply {
	_id?: Types.ObjectId | undefined;  // Make _id optional
	userId: Types.ObjectId;
	comment: string;
	userName: string;
	timestamp: Date;

}
export interface TReview extends Document {
	_id: Types.ObjectId;
	productId: Types.ObjectId;
	userId: Types.ObjectId;
	userName: string;
	rating: number;
	comment: string;
	likes: Types.ObjectId[];  // Array of User ObjectIds who liked the review
	replies: TReply[];  // Now using the TReply type
	createdAt: Date;
	updatedAt: Date;
}
