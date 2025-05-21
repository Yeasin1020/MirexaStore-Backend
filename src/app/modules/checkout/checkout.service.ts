// // services/checkout.service.ts

// import axios from "axios";
// import { OrderItem } from "../../interface/email";
// import { sendOrderConfirmationEmail, sendOrderStatusConfirmationEmail, } from "../../utils/email";
// import { NewsletterSubscriber } from "../newsletter/newsletter.model";
// import Product from "../product/product.model";
// import { TCheckout } from "./checkout.interface";
// import Checkout from "./checkout.model";

// const createOrder = async (orderData: TCheckout) => {
// 	const order = new Checkout(orderData);

// 	const subscriber = await NewsletterSubscriber.findOne({
// 		email: orderData.shippingDetails.email,
// 	});

// 	// ✅ First Order Discount Logic
// 	if (subscriber?.isFirstOrderDiscountAvailable) {
// 		const discount = order.totalPrice * 0.1;
// 		order.totalPrice = parseFloat((order.totalPrice - discount).toFixed(2));
// 		order.discountApplied = parseFloat(discount.toFixed(2));
// 		order.isFirstOrderDiscountUsed = true;

// 		subscriber.isFirstOrderDiscountAvailable = false;
// 		await subscriber.save();
// 	}

// 	// ✅ Set the Shipping Cost (based on the city)
// 	const shippingCost = orderData.shippingDetails.city === "Dhaka" ? 60 : 120;
// 	order.shippingCost = shippingCost;

// 	// ✅ Calculate Grand Total (Total Price + Shipping - Discount)
// 	const grandTotal = order.totalPrice + order.shippingCost - (order.discountApplied || 0);
// 	order.grandTotal = grandTotal;

// 	await order.save();

// 	// ✅ Order ID (last 6 digits)
// 	const orderId = `MIREXA-${order._id.toString().slice(-6)}`;

// 	const formattedItems: OrderItem[] = order.items.map((item) => ({
// 		productId: item.productId,
// 		quantity: item.quantity,
// 		price: item.price,
// 		sellerEmail: item.sellerEmail,
// 		sellerName: item.sellerName,
// 		name: item.name || 'N/A',
// 		color: item.color || 'N/A',
// 		size: item.size || 'N/A',
// 		productImage: item.productImage || [], // ensure array even if empty
// 	}));

// 	// ✅ Send Email After Saving Order
// 	await sendOrderConfirmationEmail({
// 		to: order.shippingDetails.email,
// 		name: order.shippingDetails.fullName,
// 		phone: order.shippingDetails.phone,
// 		address: order.shippingDetails.address,
// 		status: order.status,
// 		deliveryNote: order?.shippingDetails?.deliveryNote,
// 		country: order.shippingDetails.country,
// 		district: order.shippingDetails.district,
// 		city: order.shippingDetails.city,
// 		orderId,
// 		items: formattedItems,
// 		totalAmount: order.totalAmount,
// 		shippingCost: order.shippingCost,
// 		discountApplied: order.discountApplied ?? 0,
// 		totalPrice: order.totalPrice,
// 	});

// 	// ✅ Reduce stock quantity for each ordered item
// 	for (const item of order.items) {
// 		const product = await Product.findById(item.productId);
// 		if (product) {
// 			// Check if enough stock is available
// 			if (product.stockQuantity < item.quantity) {
// 				throw new Error(`Not enough stock for product: ${product.name}`);
// 			}

// 			// Reduce stock
// 			product.stockQuantity -= item.quantity;
// 			await product.save();
// 		}
// 	}

// 	return order;
// };




// const getFirstOrderCountByUserId = async (userId: string) => {
// 	const orderCount = await Checkout.countDocuments({ userId }).exec();
// 	return orderCount;
// };

// const getOrderById = async (orderId: string) => {
// 	const order = await Checkout.findById(orderId);
// 	if (!order) {
// 		throw new Error("Order not found");
// 	}
// 	return order;
// };
// const getOrdersByUserId = async (userId: string) => {
// 	return await Checkout.find({ userId })
// 		.sort({ createdAt: -1 })
// 		.exec();
// };



// const getAllOrders = async () => {
// 	return await Checkout.find().exec();
// };

// // Order Status Update and Email Send
// const updateOrderStatusInDb = async (id: string, status: string) => {
// 	const updatedOrder = await Checkout.findByIdAndUpdate(id, { status }, { new: true }).lean().exec();

// 	if (!updatedOrder) {
// 		throw new Error('Order not found');
// 	}

// 	// Send Shipment or Delivery Email based on Status Change
// 	if (status === "Shipped" || status === "Delivered") {
// 		await sendOrderStatusConfirmationEmail({
// 			to: updatedOrder.shippingDetails.email,
// 			name: updatedOrder.shippingDetails.fullName,
// 			phone: updatedOrder.shippingDetails.phone,
// 			orderId: `MIREXA-${updatedOrder._id.toString().slice(-6)}`,
// 			address: updatedOrder.shippingDetails.address,
// 			status: updatedOrder.status,
// 			deliveryNote: updatedOrder.shippingDetails.deliveryNote,
// 			country: updatedOrder.shippingDetails.country,
// 			district: updatedOrder.shippingDetails.district,
// 			city: updatedOrder.shippingDetails.city,
// 			items: updatedOrder.items.map((item) => ({
// 				productId: item.productId,
// 				quantity: item.quantity,
// 				sellerEmail: item.sellerEmail,
// 				price: item.price,
// 				name: item.name || 'N/A',
// 				color: item.color || 'N/A',
// 				size: item.size || 'N/A',
// 				productImage: item.productImage || [], // ensure array even if empty
// 			})),
// 			totalAmount: updatedOrder.totalAmount,
// 			shippingCost: updatedOrder.shippingCost,
// 			discountApplied: updatedOrder.discountApplied ?? 0,
// 			totalPrice: updatedOrder.totalPrice,
// 		});
// 	}

// 	return updatedOrder;
// };






// const deleteOrderById = async (orderId: string) => {
// 	const order = await Checkout.findByIdAndDelete(orderId);
// 	if (!order) {
// 		throw new Error("Order not found or already deleted");
// 	}
// 	return order;
// };



// // SSLCommerz API credentials
// const sslCommerzCredentials = {
// 	store_id: "campu68147a08a6052",
// 	store_passwd: "campu68147a08a6052@ssl",
// 	sandbox: true, // Make sure this is true if you're testing in sandbox
// };

// // Payment initiation function
// const initiatePayment = async (order: TCheckout) => {
// 	const baseURL = "https://campus-needs-backend.vercel.app"; // Your registered domain

// 	// Payment data object to send to SSLCommerz API
// 	const paymentData = {
// 		store_id: sslCommerzCredentials.store_id,
// 		store_passwd: sslCommerzCredentials.store_passwd,
// 		total_amount: order.grandTotal,  // Total amount to be paid
// 		currency: "BDT",  // Currency for the transaction (Bangladeshi Taka)
// 		tran_id: `MIREXA-${order._id.toString().slice(-6)}`,  // Transaction ID
// 		success_url: `${baseURL}/api/checkout/payment-success/${order._id}`,  // URL for success response
// 		fail_url: `${baseURL}/api/checkout/payment-fail/${order._id}`,  // URL for failure response
// 		cancel_url: `${baseURL}/api/checkout/payment-cancel/${order._id}`,  // Optional, URL for cancellation
// 		shipping_method: "NO",  // Shipping method (NO for not applicable)
// 		product_name: "Order Payment",  // Name of the product
// 		product_category: "Product",  // Category of the product
// 		product_profile: "general",  // Type of product (general)
// 		cus_name: order.shippingDetails.fullName,  // Customer's name
// 		cus_email: order.shippingDetails.email,  // Customer's email
// 		cus_phone: order.shippingDetails.phone,  // Customer's phone number
// 		cus_add1: order.shippingDetails.address,  // Customer's address
// 		cus_city: order.shippingDetails.city,  // Customer's city
// 		cus_postcode: "1000",  // Customer's postal code (hardcoded as 1000)
// 		cus_country: order.shippingDetails.country,  // Customer's country
// 	};

// 	try {
// 		// Use sandbox URL if testing; otherwise, use live URL for production
// 		const apiUrl = sslCommerzCredentials.sandbox
// 			? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
// 			: "https://secure.sslcommerz.com/gwprocess/v4/api.php";

// 		// Make a POST request to the SSLCommerz API to initiate payment
// 		const response = await axios.post(apiUrl, paymentData, {
// 			timeout: 10000,  // 10 seconds timeout for the request
// 		});

// 		// Check if the response contains the Gateway Page URL for redirection
// 		if (response.data?.GatewayPageURL) {
// 			return response.data.GatewayPageURL;  // Return the Gateway URL for redirection
// 		} else {
// 			throw new Error("Failed to initiate payment");
// 		}
// 	} catch (error: unknown) {
// 		// Handle different types of errors
// 		if (error instanceof Error) {
// 			// If it's a known error, throw it with a message
// 			throw new Error("Payment initiation failed: " + error.message);
// 		} else {
// 			// If it's an unknown error, handle it generically
// 			throw new Error("Unknown error during payment initiation");
// 		}
// 	}
// };




// // Callback function to handle payment success
// const handlePaymentSuccess = async (orderId: string) => {
// 	try {
// 		const order = await Checkout.findById(orderId);
// 		if (!order) {
// 			throw new Error('Order not found');
// 		}

// 		// Update the order status and payment details
// 		order.status = "Paid";  // Mark order as paid
// 		order.paymentStatus = "Success"; // Set payment status to success
// 		order.paymentApprovedByAdmin = true; // Mark as approved by admin
// 		order.adminApprovalDate = new Date(); // Add approval date
// 		await order.save();

// 		// Optionally, assign seller if needed
// 		if (!order.paymentAssignedToseller && order.sellerId) {
// 			order.paymentAssignedToseller = true;  // Assign payment to seller
// 			await order.save();
// 		}

// 		return order;
// 	} catch (error: unknown) {
// 		if (error instanceof Error) {
// 			throw new Error('Payment success handling failed: ' + error.message);
// 		} else {
// 			throw new Error('Payment success handling failed: Unknown error occurred');
// 		}
// 	}
// };


// // Callback function to handle payment failure
// const handlePaymentFailure = async (orderId: string) => {
// 	try {
// 		const order = await Checkout.findById(orderId);
// 		if (!order) {
// 			throw new Error('Order not found');
// 		}

// 		// Mark the order as payment failed
// 		order.status = "Payment Failed";
// 		order.paymentStatus = "Failed";  // Set payment status to failed
// 		await order.save();

// 		return order;
// 	} catch (error: unknown) {
// 		// Type narrowing to check if the error is an instance of Error
// 		if (error instanceof Error) {
// 			throw new Error('Payment failure handling failed: ' + error.message);
// 		} else {
// 			// Handle other cases, e.g., if the error is not an instance of Error
// 			throw new Error('Payment failure handling failed: Unknown error occurred');
// 		}
// 	}
// };


// // Callback function to handle payment cancel
// const handlePaymentCancel = async (orderId: string) => {
// 	try {
// 		const order = await Checkout.findById(orderId);
// 		if (!order) {
// 			throw new Error('Order not found');
// 		}

// 		// Mark the order as cancelled
// 		order.status = "Cancelled";
// 		order.paymentStatus = "Canceled";  // Set payment status to canceled
// 		await order.save();

// 		return order;
// 	} catch (error: unknown) {
// 		// Type narrowing to check if the error is an instance of Error
// 		if (error instanceof Error) {
// 			throw new Error('Payment cancellation handling failed: ' + error.message);
// 		} else {
// 			// Handle other cases, e.g., if the error is not an instance of Error
// 			throw new Error('Payment cancellation handling failed: Unknown error occurred');
// 		}
// 	}
// };

// export const CheckoutService = {
// 	createOrder,
// 	getFirstOrderCountByUserId,
// 	getOrderById,
// 	getOrdersByUserId,
// 	getAllOrders,
// 	updateOrderStatusInDb,
// 	deleteOrderById,
// 	initiatePayment,
// 	handlePaymentSuccess,
// 	handlePaymentFailure,
// 	handlePaymentCancel
// };



// services/checkout.service.ts

import { OrderItem } from "../../interface/email";
import { sendOrderConfirmationEmail, sendOrderStatusConfirmationEmail, } from "../../utils/email";
import { NewsletterSubscriber } from "../newsletter/newsletter.model";
import Product from "../product/product.model";
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

	// ✅ Set the Shipping Cost (based on the city)
	const shippingCost = orderData.shippingDetails.city === "Dhaka" ? 60 : 120;
	order.shippingCost = shippingCost;

	// ✅ Calculate Grand Total (Total Price + Shipping - Discount)
	const grandTotal = order.totalPrice + order.shippingCost - (order.discountApplied || 0);
	order.grandTotal = grandTotal;

	await order.save();

	// ✅ Order ID (last 6 digits)
	const orderId = `MIREXA-${order._id.toString().slice(-6)}`;

	const formattedItems: OrderItem[] = order.items.map((item) => ({
		productId: item.productId,
		quantity: item.quantity,
		price: item.price,
		sellerEmail: item.sellerEmail,
		sellerName: item.sellerName,
		name: item.name || 'N/A',
		color: item.color || 'N/A',
		size: item.size || 'N/A',
		productImage: item.productImage || [], // ensure array even if empty
	}));

	// ✅ Send Email After Saving Order
	await sendOrderConfirmationEmail({
		to: order.shippingDetails.email,
		name: order.shippingDetails.fullName,
		phone: order.shippingDetails.phone,
		address: order.shippingDetails.address,
		status: order.status,
		deliveryNote: order?.shippingDetails?.deliveryNote,
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

	// ✅ Reduce stock quantity for each ordered item
	for (const item of order.items) {
		const product = await Product.findById(item.productId);
		if (product) {
			// Check if enough stock is available
			if (product.stockQuantity < item.quantity) {
				throw new Error(`Not enough stock for product: ${product.name}`);
			}

			// Reduce stock
			product.stockQuantity -= item.quantity;
			await product.save();
		}
	}

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