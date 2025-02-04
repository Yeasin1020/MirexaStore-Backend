// controllers/checkout.controller.ts

import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { CheckoutService } from "./checkout.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
	const orderData = req.body;
	const newOrder = await CheckoutService.createOrder(orderData);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Order placed successfully",
		data: newOrder,
	});
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
	const { orderId } = req.params;
	const order = await CheckoutService.getOrderById(orderId);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Order retrieved successfully",
		data: order,
	});
});

const getOrdersByUserId = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.params; // Get userId from the URL
	const orders = await CheckoutService.getOrdersByUserId(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Orders retrieved successfully",
		data: orders,
	});
});


const getAllOrders = catchAsync(async (req: Request, res: Response) => {
	const orders = await CheckoutService.getAllOrders();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Orders retrieved successfully",
		data: orders,
	});
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	// Validate new status
	const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
	if (!validStatuses.includes(status)) {
		throw new Error('Invalid status');
	}

	const updatedOrder = await CheckoutService.updateOrderStatusInDb(id, status);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Order status updated to ${status}`,
		data: updatedOrder,
	});
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
	const { orderId } = req.params;
	const deletedOrder = await CheckoutService.deleteOrderById(orderId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Order deleted successfully",
		data: deletedOrder,
	});
});




export const CheckoutController = {
	createOrder,
	getOrderById,
	getOrdersByUserId,
	getAllOrders,
	updateOrderStatus,
	deleteOrder
};
