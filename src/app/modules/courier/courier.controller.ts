// modules/courier/courier.controller.ts

import { Request, Response } from "express";
import * as CourierService from "./courier.service";

// POST /courier/request
export const requestCourier = async (req: Request, res: Response) => {
	try {
		const result = await CourierService.createCourierRequest(req.body);
		res.status(201).json({
			message: "Courier requested successfully",
			data: result,
		});
	} catch (error: any) {
		console.error("Courier request error:", error);
		res.status(400).json({ message: error.message });
	}
};


// GET /courier/:orderId
export const getCourier = async (req: Request, res: Response) => {
	try {
		const result = await CourierService.getCourierByOrder(req.params.orderId);
		if (!result) {
			return res.status(404).json({ message: "Courier not found for this order" });
		}
		res.status(200).json({ data: result });
	} catch (error) {
		res.status(500).json({ message: "Failed to fetch courier data" });
	}
};
