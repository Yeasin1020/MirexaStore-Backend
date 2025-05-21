// routes/checkout.route.ts

import express from "express";
import authenticate from "../../middlewares/authenticate";
import { CheckoutController } from "./checkout.controller";
import adminMiddleware from "../../middlewares/adminAuthorization";
import sellerAdminMiddleware from "../../middlewares/sellerAdminAuthorization";

const router = express.Router();

router.post("/", authenticate, CheckoutController.createOrder); // Place order route
router.post("/check-first-order/:userId", CheckoutController.getFirstOrderCheckByUserId); // Check if first order
router.get("/:orderId", authenticate, sellerAdminMiddleware, CheckoutController.getOrderById); // Get order details
router.get("/", authenticate, CheckoutController.getAllOrders); // Get all orders
router.get("/order/:userId", CheckoutController.getOrdersByUserId); // Get orders by user ID
router.patch("/update-status/:id", authenticate, sellerAdminMiddleware, CheckoutController.updateOrderStatus); // Update order status route
router.delete("/:orderId", authenticate, adminMiddleware, CheckoutController.deleteOrder); // Delete order route

// router.post('/initiate-payment/:orderId', authenticate, CheckoutController.initiatePayment);
// router.post("/payment-success/:orderId", CheckoutController.paymentSuccess);
// router.post("/payment-fail/:orderId", CheckoutController.paymentFail);

export const CheckoutRoutes = router;