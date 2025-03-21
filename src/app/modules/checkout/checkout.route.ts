// routes/checkout.route.ts

import express from "express";
import authenticate from "../../middlewares/authenticate";
import { CheckoutController } from "./checkout.controller";
import adminMiddleware from "../../middlewares/adminAuthorization";

const router = express.Router();

router.post("/", authenticate, CheckoutController.createOrder); // Place order route
router.post("/check-first-order/:userId", CheckoutController.getFirstOrderCheckByUserId); // Check if first order
router.get("/:orderId", authenticate, adminMiddleware, CheckoutController.getOrderById); // Get order details
router.get("/", authenticate, adminMiddleware, CheckoutController.getAllOrders); // Get all orders
router.get("/order/:userId", CheckoutController.getOrdersByUserId); // Get orders by user ID
router.patch("/update-status/:id", authenticate, adminMiddleware, CheckoutController.updateOrderStatus); // Update order status route
router.delete("/:orderId", authenticate, adminMiddleware, CheckoutController.deleteOrder); // Delete order route

export const CheckoutRoutes = router;
