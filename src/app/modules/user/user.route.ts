import express from "express";
import authenticate from "../../middlewares/authenticate";
import adminMiddleware from "../../middlewares/adminAuthorization";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.get("/me", authenticate, UserControllers.getProfile);
router.get("/", authenticate, adminMiddleware, UserControllers.getAllUsers);
router.delete("/:id", authenticate, adminMiddleware, UserControllers.deleteUser);
router.patch("/:id/role", authenticate, adminMiddleware, UserControllers.makeAdmin);

export const UserRoutes = router;
