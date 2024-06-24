// controllers/bike.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BikeService } from './bike.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createBike = catchAsync(async (req: Request, res: Response) => {
	const newBike = await BikeService.createBikeIntoDb(req.body);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Bike added successfully',
		data: newBike,
	});
});

const getAllBikes = catchAsync(async (req: Request, res: Response) => {
	const bikes = await BikeService.getAllBikesFromDb();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Bikes retrieved successfully',
		data: bikes,
	});
});

const updateBike = catchAsync(async (req: Request, res: Response) => {
	const bikeId = req.params.id;
	const updatedBikeData = req.body;
	const updatedBike = await BikeService.updateBikeIntoDb(bikeId, updatedBikeData);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Bike updated successfully',
		data: updatedBike,
	});
});

export const deleteBike = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const bike = await BikeService.deleteBikeFromDb(id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Bike deleted successfully',
		data: bike,
	});
});

export const BikeController = {
	createBike,
	getAllBikes,
	updateBike,
	deleteBike
};
