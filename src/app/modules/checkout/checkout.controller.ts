// // controllers/checkout.controller.ts

// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import sendResponse from "../../utils/sendResponse";
// import catchAsync from "../../utils/catchAsync";
// import { CheckoutService } from "./checkout.service";

// const createOrder = catchAsync(async (req: Request, res: Response) => {
// 	const orderData = req.body;
// 	const newOrder = await CheckoutService.createOrder(orderData);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: newOrder.isFirstOrderDiscountUsed
// 			? "Order placed successfully with 10% discount!"
// 			: "Order placed successfully",
// 		data: newOrder,
// 	});
// });

// const getFirstOrderCheckByUserId = catchAsync(async (req: Request, res: Response) => {
// 	const { userId } = req.params; // Get userId from the URL
// 	const orderCount = await CheckoutService.getFirstOrderCountByUserId(userId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "First order check successful",
// 		data: {
// 			isFirstOrder: orderCount === 0, // If count is 0, it's the first order
// 		},
// 	});
// });

// const getOrderById = catchAsync(async (req: Request, res: Response) => {
// 	const { orderId } = req.params;
// 	const order = await CheckoutService.getOrderById(orderId);
// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Order retrieved successfully",
// 		data: order,
// 	});
// });

// const getOrdersByUserId = catchAsync(async (req: Request, res: Response) => {
// 	const { userId } = req.params; // Get userId from the URL
// 	const orders = await CheckoutService.getOrdersByUserId(userId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Orders retrieved successfully",
// 		data: orders,
// 	});
// });


// const getAllOrders = catchAsync(async (req: Request, res: Response) => {
// 	const orders = await CheckoutService.getAllOrders();

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Orders retrieved successfully",
// 		data: orders,
// 	});
// });

// const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
// 	const { id } = req.params;
// 	const { status } = req.body;

// 	// Validate new status
// 	const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
// 	if (!validStatuses.includes(status)) {
// 		throw new Error('Invalid status');
// 	}

// 	const updatedOrder = await CheckoutService.updateOrderStatusInDb(id, status);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: `Order status updated to ${status}`,
// 		data: updatedOrder,
// 	});
// });

// const deleteOrder = catchAsync(async (req: Request, res: Response) => {
// 	const { orderId } = req.params;
// 	const deletedOrder = await CheckoutService.deleteOrderById(orderId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Order deleted successfully",
// 		data: deletedOrder,
// 	});
// });



// // Initiate Payment
// const initiatePayment = catchAsync(async (req: Request, res: Response) => {
// 	const { orderId } = req.params;
// 	const order = await CheckoutService.getOrderById(orderId);
// 	if (!order) {
// 		return res.status(httpStatus.NOT_FOUND).send({
// 			success: false,
// 			message: 'Order not found',
// 		});
// 	}

// 	const paymentGatewayUrl = await CheckoutService.initiatePayment(order);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: 'Payment initiated successfully',
// 		data: { paymentGatewayUrl },
// 	});
// });

// // Handle Payment Success
// const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
// 	const { orderId } = req.params;
// 	const order = await CheckoutService.handlePaymentSuccess(orderId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: 'Payment successful',
// 		data: order,
// 	});
// });

// // Handle Payment Failure
// const paymentFail = catchAsync(async (req: Request, res: Response) => {
// 	const { orderId } = req.params;
// 	const order = await CheckoutService.handlePaymentFailure(orderId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: false,
// 		message: 'Payment failed',
// 		data: order,
// 	});
// });

// // Handle Payment Cancel
// const paymentCancel = catchAsync(async (req: Request, res: Response) => {
// 	const { orderId } = req.params;
// 	const order = await CheckoutService.handlePaymentCancel(orderId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: false,
// 		message: 'Payment canceled',
// 		data: order,
// 	});
// });

// export const CheckoutController = {
// 	createOrder,
// 	getFirstOrderCheckByUserId,
// 	getOrderById,
// 	getOrdersByUserId,
// 	getAllOrders,
// 	updateOrderStatus,
// 	deleteOrder,
// 	initiatePayment,
// 	paymentSuccess,
// 	paymentFail,
// 	paymentCancel,
// };



// controllers / checkout.controller.ts

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
		message: newOrder.isFirstOrderDiscountUsed
			? "Order placed successfully with 10% discount!"
			: "Order placed successfully",
		data: newOrder,
	});
});

const getFirstOrderCheckByUserId = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.params; // Get userId from the URL
	const orderCount = await CheckoutService.getFirstOrderCountByUserId(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "First order check successful",
		data: {
			isFirstOrder: orderCount === 0, // If count is 0, it's the first order
		},
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
	getFirstOrderCheckByUserId,
	getOrderById,
	getOrdersByUserId,
	getAllOrders,
	updateOrderStatus,
	deleteOrder
};