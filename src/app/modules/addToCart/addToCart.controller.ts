// import { Request, Response } from "express";
// import httpStatus from "http-status";
// import { AddToCartService } from "./addToCart.service";
// import catchAsync from "../../utils/catchAsync";
// import sendResponse from "../../utils/sendResponse";
// import mongoose from "mongoose";

// // Validate if a string is a valid ObjectId
// const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// // Add product to cart
// const addProductToCart = catchAsync(async (req: Request, res: Response) => {
// 	const { userId, productId, quantity } = req.body;

// 	if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
// 		return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid userId or productId" });
// 	}

// 	const cartItem = await AddToCartService.addProductToCart(userId, productId, quantity);

// 	sendResponse(res, {
// 		statusCode: httpStatus.CREATED,
// 		success: true,
// 		message: "Product added to cart successfully",
// 		data: cartItem,
// 	});
// });

// // Update product in cart
// const updateProductInCart = catchAsync(async (req: Request, res: Response) => {
// 	const { id: cartItemId } = req.params;
// 	const { quantity } = req.body;

// 	if (!cartItemId || !isValidObjectId(cartItemId)) {
// 		return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Cart Item ID" });
// 	}

// 	const updatedCartItem = await AddToCartService.updateProductInCart(cartItemId, quantity);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Cart item updated successfully",
// 		data: updatedCartItem,
// 	});
// });

// // Remove product from cart
// const removeProductFromCart = catchAsync(async (req: Request, res: Response) => {
// 	const { id: cartItemId } = req.params;

// 	if (!cartItemId || !isValidObjectId(cartItemId)) {
// 		return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Cart Item ID" });
// 	}

// 	const removedCartItem = await AddToCartService.removeProductFromCart(cartItemId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Product removed from cart successfully",
// 		data: removedCartItem,
// 	});
// });

// // Get all products in cart
// const getAllProductsInCart = catchAsync(async (req: Request, res: Response) => {
// 	const { userId } = req.params;

// 	if (!isValidObjectId(userId)) {
// 		return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid userId" });
// 	}

// 	const cartItems = await AddToCartService.getAllProductsInCart(userId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Cart items retrieved successfully",
// 		data: cartItems,
// 	});
// });

// // Purchase product in cart
// const purchaseProductInCart = catchAsync(async (req: Request, res: Response) => {
// 	const { cartItemId } = req.params;

// 	if (!cartItemId || !isValidObjectId(cartItemId)) {
// 		return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Cart Item ID" });
// 	}

// 	const purchasedCartItem = await AddToCartService.purchaseProductInCart(cartItemId);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Cart item purchased successfully",
// 		data: purchasedCartItem,
// 	});
// });

// export const AddToCartController = {
// 	addProductToCart,
// 	updateProductInCart,
// 	removeProductFromCart,
// 	getAllProductsInCart,
// 	purchaseProductInCart,
// };
