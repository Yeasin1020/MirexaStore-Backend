import { Request, Response } from "express";
import httpStatus from "http-status";
import { AddToCartService } from "./addToCart.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import mongoose from "mongoose";

const addProductToCart = catchAsync(async (req: Request, res: Response) => {
	const { userId, productId, quantity } = req.body;

	const cartItem = await AddToCartService.addProductToCart(userId, productId, quantity);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Product added to cart successfully",
		data: cartItem,
	});
});

const updateProductInCart = catchAsync(async (req: Request, res: Response) => {
	const { id: cartItemId } = req.params; // Correctly extract ID from params
	const { quantity } = req.body;

	if (!cartItemId) {
		throw new Error("Cart Item ID is missing in the URL");
	}

	console.log("Cart Item ID from URL:", cartItemId);
	console.log("Quantity from Body:", quantity);

	// Update the cart item using the service
	const updatedCartItem = await AddToCartService.updateProductInCart(cartItemId, quantity);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Cart item updated successfully",
		data: updatedCartItem,
	});
});



const removeProductFromCart = catchAsync(async (req: Request, res: Response) => {
	const cartItemId = req.params.id; // Access the 'id' parameter from the URL

	console.log("Received cartItemId: ", cartItemId); // Log the received ID to ensure it's being captured

	const removedCartItem = await AddToCartService.removeProductFromCart(cartItemId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Product removed from cart successfully",
		data: removedCartItem,
	});
});


const getAllProductsInCart = catchAsync(async (req: Request, res: Response) => {
	const { userId } = req.params;

	const cartItems = await AddToCartService.getAllProductsInCart(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Cart items retrieved successfully",
		data: cartItems,
	});
});

const purchaseProductInCart = catchAsync(async (req: Request, res: Response) => {
	const { cartItemId } = req.params;

	const purchasedCartItem = await AddToCartService.purchaseProductInCart(cartItemId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Cart item purchased successfully",
		data: purchasedCartItem,
	});
});

export const AddToCartController = {
	addProductToCart,
	updateProductInCart,
	removeProductFromCart,
	getAllProductsInCart,
	purchaseProductInCart,
};
