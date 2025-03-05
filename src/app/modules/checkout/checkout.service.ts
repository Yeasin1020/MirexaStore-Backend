// services/checkout.service.ts

import { sendOrderConfirmationEmail } from "../../utils/email";
import { NewsletterSubscriber } from "../newsletter/newsletter.model";
import { TCheckout } from "./checkout.interface";
import Checkout from "./checkout.model";

const createOrder = async (orderData: TCheckout) => {
	const order = new Checkout(orderData);

	const subscriber = await NewsletterSubscriber.findOne({ email: orderData.shippingDetails.email });

	if (subscriber && subscriber.isFirstOrderDiscountAvailable) {
		const discount = order.totalPrice * 0.1;
		order.totalPrice -= discount;
		order.discountApplied = discount;
		order.isFirstOrderDiscountUsed = true;

		subscriber.isFirstOrderDiscountAvailable = false;
		await subscriber.save();
	}

	await order.save();

	// ✅ Order save হওয়ার পর email পাঠানো
	await sendOrderConfirmationEmail(
		order.shippingDetails.email,
		order.shippingDetails.fullName,
		`MIREXA-${order._id.toString().slice(-6)}`,
		order.items,
		order.totalAmount,
		order.shippingCost,
		order.discountApplied ?? 0, // This can be undefined
		order.grandTotal,
		order.totalPrice
	);


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
