import { Schema } from "mongoose";
export type TRental = {
	userId: Schema.Types.ObjectId;
	bikeId: Schema.Types.ObjectId;
	startTime: Date;
	returnTime?: Date | null;
	totalCost: number;
	isReturned: boolean;
};
