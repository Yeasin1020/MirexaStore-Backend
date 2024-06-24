// services/bike.service.ts

import { Types } from "mongoose";
import { TBike } from "./bike.interface";
import Bike from "./bike.model";


const createBikeIntoDb = async (bikeData: Partial<TBike>) => {
	const newBike = new Bike(bikeData);
	await newBike.save();
	return newBike;
};

const getAllBikesFromDb = async () => {
	return await Bike.find(); // Retrieve all bikes from the database
};

const updateBikeIntoDb = async (id: string, updateData: Partial<TBike>) => {
	const updatedBike = await Bike.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
	if (!updatedBike) {
		throw new Error('Bike not found');
	}
	return updatedBike;
};

export const deleteBikeFromDb = async (id: string) => {
	if (!Types.ObjectId.isValid(id)) {
		throw new Error('Invalid bike ID');
	}

	const bike = await Bike.findByIdAndDelete(id);
	if (!bike) {
		throw new Error('Bike not found');
	}
}
export const BikeService = {
	createBikeIntoDb,
	getAllBikesFromDb,
	updateBikeIntoDb,
	deleteBikeFromDb
};
