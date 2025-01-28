import { Schema, model } from 'mongoose';
import Product from '../product/product.model'; // Import the Product model
import { TAddToCart } from './addToCart.interface'; // Import the interface for AddToCart

const addToCartSchema = new Schema<TAddToCart>({
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
	quantity: { type: Number, required: true, min: 1 },
	addedAt: { type: Date, default: Date.now },
	isPurchased: { type: Boolean, default: false },
});

// Middleware to check if the stock is available before adding the product to the cart
addToCartSchema.pre('save', async function (next) {
	const product = await Product.findById(this.productId); // Get product by ID

	// Check if the product exists and if the stock quantity is sufficient
	if (product && product.stockQuantity >= this.quantity) {
		next(); // Proceed with saving the cart item
	} else {
		const err = new Error('Insufficient stock to add this product to the cart');
		next(err); // Prevent saving the cart item and return an error
	}
});

const AddToCart = model<TAddToCart>('AddToCart', addToCartSchema);

export default AddToCart;
