import { Types } from "mongoose";
import Product from "../product/product.model"; // Product model
import AddToCart from "./addToCart.model"; // AddToCart model

// Helper to find product and validate stock
const findProductAndValidateStock = async (productId: Types.ObjectId, requiredQuantity: number) => {
	const product = await Product.findById(productId);
	if (!product) {
		throw new Error("Product not found");
	}
	if (product.stockQuantity < requiredQuantity) {
		throw new Error("Insufficient stock for this product");
	}
	return product;
};

// Add a product to the cart
const addProductToCart = async (userId: Types.ObjectId, productId: Types.ObjectId, quantity: number) => {
	// Validate product and stock
	const product = await findProductAndValidateStock(productId, quantity);

	// Check if the product already exists in the user's cart
	let cartItem = await AddToCart.findOne({ userId, productId });
	if (cartItem) {
		// Update the existing cart item
		cartItem.quantity += quantity;
	} else {
		// Create a new cart item
		cartItem = new AddToCart({
			userId,
			productId,
			quantity,
			addedAt: new Date(),
			isPurchased: false,
		});
	}

	// Save the cart item
	await cartItem.save();

	// Update the product's stock
	product.stockQuantity -= quantity;
	await product.save();

	return cartItem;
};

// Update the quantity of a product in the cart
const updateProductInCart = async (cartItemId: Types.ObjectId, quantity: number) => {
	const cartItem = await AddToCart.findById(cartItemId).populate("productId");
	if (!cartItem) {
		throw new Error("Cart item not found");
	}

	const product = cartItem.productId as any;

	// Calculate stock adjustment
	const stockAdjustment = quantity - cartItem.quantity;
	if (product.stockQuantity < stockAdjustment) {
		throw new Error("Insufficient stock to update the cart item");
	}

	// Update cart item quantity and product stock
	cartItem.quantity = quantity;
	product.stockQuantity -= stockAdjustment;

	await Promise.all([cartItem.save(), product.save()]);
	return cartItem;
};

const removeProductFromCart = async (cartItemId: string) => {
	// Ensure that cartItemId is converted to ObjectId using 'new'
	const cartItem = await AddToCart.findById(new Types.ObjectId(cartItemId)).populate("productId");

	if (!cartItem) {
		throw new Error("Cart item not found");
	}

	console.log("Found cartItem: ", cartItem); // Log to check if cart item is found correctly

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const product = cartItem.productId as any; // Access the associated product

	// Ensure the product and stock quantity are correct
	if (product.stockQuantity < cartItem.quantity) {
		throw new Error("Insufficient stock to return");
	}

	// Return the stock quantity to the product
	product.stockQuantity += cartItem.quantity;

	// Save the updated product
	await product.save();

	// Now delete the cart item
	await AddToCart.findByIdAndDelete(cartItemId);  // Use deleteOne or findByIdAndDelete to delete the item

	console.log("Product stock updated, cart item removed");

	return cartItem;
};


// Get all products in the cart for a user
const getAllProductsInCart = async (userId: Types.ObjectId) => {
	const cartItems = await AddToCart.find({ userId }).populate("productId");
	return cartItems;
};

// Mark a cart item as purchased
const purchaseProductInCart = async (cartItemId: Types.ObjectId) => {
	const cartItem = await AddToCart.findById(cartItemId);
	if (!cartItem) {
		throw new Error("Cart item not found");
	}

	// Mark as purchased
	cartItem.isPurchased = true;
	await cartItem.save();

	return cartItem;
};

export const AddToCartService = {
	addProductToCart,
	updateProductInCart,
	removeProductFromCart,
	getAllProductsInCart,
	purchaseProductInCart,
};
