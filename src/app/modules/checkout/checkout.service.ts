
import { OrderItem } from "../../interface/email";
import { sendOrderConfirmationEmail, sendOrderStatusConfirmationEmail, } from "../../utils/email";
import { NewsletterSubscriber } from "../newsletter/newsletter.model";
import Product from "../product/product.model";
import { TCheckout } from "./checkout.interface";
import Checkout from "./checkout.model";

const createOrder = async (orderData: TCheckout) => {
	// Check stock BEFORE creating order to avoid partial order saves
	for (const item of orderData.items) {
		const product = await Product.findById(item.productId);
		if (!product) {
			throw new Error(`Product not found: ${item.productId}`);
		}
		if (product.stockQuantity < item.quantity) {
			throw new Error(`Not enough stock for product: ${product.name}`);
		}
	}

	// Create new order document
	const order = new Checkout(orderData);

	// Check if subscriber has first order discount available
	const subscriber = await NewsletterSubscriber.findOne({
		email: orderData.shippingDetails.email,
	});

	if (subscriber?.isFirstOrderDiscountAvailable) {
		const discount = order.totalPrice * 0.1;
		order.totalPrice = parseFloat((order.totalPrice - discount).toFixed(2));
		order.discountApplied = parseFloat(discount.toFixed(2));
		order.isFirstOrderDiscountUsed = true;

		subscriber.isFirstOrderDiscountAvailable = false;
		await subscriber.save();
	}

	// Set shipping cost (use from frontend or default 0)
	order.shippingCost = orderData.shippingCost || 0;

	// Calculate grand total: totalPrice + shippingCost - discountApplied
	order.grandTotal = order.totalPrice + order.shippingCost - (order.discountApplied || 0);

	// Set adminBkashStatus if payment method is adminBkash
	if (order.paymentMethod === "adminBkash") {
		order.adminBkashStatus = "received"; // initial status
	}

	// Save the order
	await order.save();

	// Reduce stock quantity for each product AFTER order saved
	for (const item of order.items) {
		const product = await Product.findById(item.productId);
		if (product) {
			product.stockQuantity -= item.quantity;
			await product.save();
		}
	}

	// Generate order ID string from last 6 chars of _id
	const orderId = `CN-${order._id.toString().slice(-6)}`;

	const formattedItems: OrderItem[] = order.items.map((item) => ({
		productId: item.productId,
		quantity: item.quantity,
		price: item.price,
		sellerEmail: item.sellerEmail,
		sellerName: item.sellerName,
		name: item.name || "N/A",
		color: item.color || "N/A",
		size: item.size || "N/A",
		productImage: item.productImage || [],
	}));

	// Send order confirmation email
	await sendOrderConfirmationEmail({
		to: order.shippingDetails.email,
		name: order.shippingDetails.fullName,
		phone: order.shippingDetails.phone,
		address: order.shippingDetails.address,
		status: order.status,
		deliveryNote: order.shippingDetails.deliveryNote,
		country: order.shippingDetails.country,
		district: order.shippingDetails.district,
		city: order.shippingDetails.city,
		orderId,
		items: formattedItems,
		totalAmount: order.totalAmount,
		shippingCost: order.shippingCost,
		discountApplied: order.discountApplied ?? 0,
		totalPrice: order.totalPrice,
	});

	// Return the cleaned JSON object (with id instead of _id)
	return order.toJSON();
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
	return await Checkout.find({ userId })
		.sort({ createdAt: -1 })
		.exec();
};



const getAllOrders = async () => {
	return await Checkout.find().exec();
};

// Order Status Update and Email Send
const updateOrderStatusInDb = async (id: string, status: string) => {
	const updatedOrder = await Checkout.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();

	if (!updatedOrder) {
		throw new Error('Order not found');
	}

	// Send Shipment or Delivery Email based on Status Change
	if (status === "Shipped" || status === "Delivered") {
		await sendOrderStatusConfirmationEmail({
			to: updatedOrder.shippingDetails.email,
			name: updatedOrder.shippingDetails.fullName,
			phone: updatedOrder.shippingDetails.phone,
			orderId: `MIREXA-${updatedOrder._id.toString().slice(-6)}`,
			address: updatedOrder.shippingDetails.address,
			status: updatedOrder.status,
			deliveryNote: updatedOrder.shippingDetails.deliveryNote,
			country: updatedOrder.shippingDetails.country,
			district: updatedOrder.shippingDetails.district,
			city: updatedOrder.shippingDetails.city,
			items: updatedOrder.items.map((item) => ({
				productId: item.productId,
				quantity: item.quantity,
				sellerEmail: item.sellerEmail,
				price: item.price,
				name: item.name || 'N/A',
				color: item.color || 'N/A',
				size: item.size || 'N/A',
				productImage: item.productImage || [], // ensure array even if empty
			})),
			totalAmount: updatedOrder.totalAmount,
			shippingCost: updatedOrder.shippingCost,
			discountApplied: updatedOrder.discountApplied ?? 0,
			totalPrice: updatedOrder.totalPrice,
		});
	}

	return updatedOrder;
};


// ✅ NEW: ADMIN PAYS SELLER
const updateAdminBkashStatus = async (id: string) => {
	const updated = await Checkout.findByIdAndUpdate(
		id,
		{ adminBkashStatus: "paidToSeller" },
		{ new: true }
	).exec();

	if (!updated) {
		throw new Error("Order not found or could not update payment status");
	}

	// Optional: notify seller via email here if needed

	return updated;
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
	deleteOrderById,
	updateAdminBkashStatus
};