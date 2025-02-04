// services/checkout.service.ts

import { TCheckout } from "./checkout.interface";
import Checkout from "./checkout.model";



const createOrder = async (orderData: TCheckout) => {
	const order = new Checkout(orderData);
	await order.save();
	return order;
};

const getOrderById = async (orderId: string) => {
	const order = await Checkout.findById(orderId);
	if (!order) {
		throw new Error("Order not found");
	}
	return order;
};
const getOrdersByUserId = async (userId: string) => {
	return await Checkout.find({ userId }).exec();
};


const getAllOrders = async () => {
	return await Checkout.find().exec();
};

// CheckoutService.ts
const updateOrderStatusInDb = async (id: string, status: string) => {
	const updatedOrder = await Checkout.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();
	if (!updatedOrder) {
		throw new Error("Order not found");
	}
	return updatedOrder;
};

const deleteOrderById = async (orderId: string) => {
	const order = await Checkout.findByIdAndDelete(orderId);
	if (!order) {
		throw new Error("Order not found or already deleted");
	}
	return order;
};

export const CheckoutService = {
	createOrder,
	getOrderById,
	getOrdersByUserId,
	getAllOrders,
	updateOrderStatusInDb,
	deleteOrderById
};
