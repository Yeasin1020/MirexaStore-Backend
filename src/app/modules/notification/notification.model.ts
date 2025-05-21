import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // receiver
		type: { type: String, enum: ['follow', 'report', 'review'], required: true },
		message: { type: String, required: true },
		link: { type: String },
		isRead: { type: Boolean, default: false },
		triggeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
		seller: { type: Schema.Types.ObjectId, ref: 'Seller' },
	},
	{ timestamps: true }
);

export const Notification = model('Notification', notificationSchema);
