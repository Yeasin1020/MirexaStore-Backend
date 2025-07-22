import express from "express";
import authenticate from "../../middlewares/authenticate";
import { CheckoutController } from "./checkout.controller";
import adminMiddleware from "../../middlewares/adminAuthorization";
import sellerAdminMiddleware from "../../middlewares/sellerAdminAuthorization";

const router = express.Router();

// ✅ Place a new order
router.post("/", authenticate, CheckoutController.createOrder);

// ✅ Check if it's the user's first order
router.post("/check-first-order/:userId", CheckoutController.getFirstOrderCheckByUserId);

// ✅ Get specific order by ID (protected for sellers/admins)
router.get("/:orderId", authenticate, sellerAdminMiddleware, CheckoutController.getOrderById);

// ✅ Get all orders (protected for authenticated users)
router.get("/", authenticate, CheckoutController.getAllOrders);

// ✅ Get orders by user ID
router.get("/order/:userId", CheckoutController.getOrdersByUserId);

// ✅ Update order status (e.g. Shipped, Delivered)
router.patch("/update-status/:id", authenticate, sellerAdminMiddleware, CheckoutController.updateOrderStatus);

// ✅ NEW: Mark order as paid to seller via Admin bKash
router.patch("/pay-seller/:orderId", authenticate, adminMiddleware, CheckoutController.markOrderAsPaidToSeller);

// ✅ Delete an order (admin only)
router.delete("/:orderId", authenticate, adminMiddleware, CheckoutController.deleteOrder);

export const CheckoutRoutes = router;
