import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductRoutes } from "../modules/product/product.route";
import { AddToCartRoutes } from "../modules/addToCart/addToCart.route";
import { CheckoutRoutes } from "../modules/checkout/checkout.route";
import { ReviewRoutes } from "../modules/review/review.route";

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/cart",
    route: AddToCartRoutes,
  },
  {
    path: "/checkout",
    route: CheckoutRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },


];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;