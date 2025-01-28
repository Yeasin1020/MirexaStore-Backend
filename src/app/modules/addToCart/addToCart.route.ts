import express from 'express';
import authenticate from '../../middlewares/authenticate';
import { AddToCartController } from './addToCart.controller';
const router = express.Router();

// Route to add product to cart
router.post('/', authenticate, AddToCartController.addProductToCart);

// Route to update product quantity in the cart
router.put('/:id', authenticate, AddToCartController.updateProductInCart);

// Route to remove product from cart
router.delete('/:id', (req, res, next) => {
	console.log("Route Params: ", req.params); // Log the full params object
	next();
}, AddToCartController.removeProductFromCart);


// Route to get all products in the user's cart
router.get('/:userId', authenticate, AddToCartController.getAllProductsInCart);

// Route to mark cart item as purchased
router.put('/:cartItemId/purchase', authenticate, AddToCartController.purchaseProductInCart);

export const AddToCartRoutes = router;
