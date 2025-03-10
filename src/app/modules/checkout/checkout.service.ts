// services/checkout.service.ts

import { sendOrderConfirmationEmail } from "../../utils/email";
import { NewsletterSubscriber } from "../newsletter/newsletter.model";
import { TCheckout } from "./checkout.interface";
import Checkout from "./checkout.model";

const createOrder = async (orderData: TCheckout) => {
	const order = new Checkout(orderData);

	const subscriber = await NewsletterSubscriber.findOne({
		email: orderData.shippingDetails.email,
	});

	// ✅ First Order Discount Logic
	if (subscriber?.isFirstOrderDiscountAvailable) {
		const discount = order.totalPrice * 0.1;
		order.totalPrice = parseFloat((order.totalPrice - discount).toFixed(2));
		order.discountApplied = parseFloat(discount.toFixed(2));
		order.isFirstOrderDiscountUsed = true;

		subscriber.isFirstOrderDiscountAvailable = false;
		await subscriber.save();
	}

	await order.save();

	// ✅ Order ID (last 6 digits)
	const orderId = `MIREXA-${order._id.toString().slice(-6)}`;

	// ✅ Send Email After Saving Order
	await sendOrderConfirmationEmail({
		to: order.shippingDetails.email,
		name: order.shippingDetails.fullName,
		phone: order.shippingDetails.phone,
		address: order.shippingDetails.address,
		deliveryNote: order.shippingDetails.deliveryNote,
		country: order.shippingDetails.country,
		district: order.shippingDetails.district,
		city: order.shippingDetails.city,
		orderId,
		items: order.items,
		totalAmount: order.totalAmount,
		shippingCost: order.shippingCost,
		discountApplied: order.discountApplied ?? 0,
		grandTotal: order.grandTotal,
		totalPrice: order.totalPrice,
	});

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
