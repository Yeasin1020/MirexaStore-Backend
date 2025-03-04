// services/checkout.service.ts

import { NewsletterSubscriber } from "../newsletter/newsletter.model";
import { TCheckout } from "./checkout.interface";
import Checkout from "./checkout.model";



const createOrder = async (orderData: TCheckout) => {
	const order = new Checkout(orderData);

	// Check if the user is subscribed to the newsletter and has discount available
	const subscriber = await NewsletterSubscriber.findOne({ email: orderData.shippingDetails.email });

	if (subscriber && subscriber.isFirstOrderDiscountAvailable) {
		const discount = order.totalPrice * 0.1; // ১০% ছাড়
		order.totalPrice -= discount;
		order.discountApplied = discount; // যদি order model-এ এই ফিল্ড থাকে
		order.isFirstOrderDiscountUsed = true; // যদি order model-এ থাকে

		// Update the subscriber's discount flag
		subscriber.isFirstOrderDiscountAvailable = false;
		await subscriber.save();
	}

	await order.save();
	return order;
};

const getFirstOrderCountByUserId = async (userId: string) => {
	const orderCount = await Checkout.countDocuments({ userId }).exec();
	return orderCount;
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
	getFirstOrderCountByUserId,
	getOrderById,
	getOrdersByUserId,
	getAllOrders,
	updateOrderStatusInDb,
	deleteOrderById
};
