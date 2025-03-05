import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CheckoutRoutes } from "../modules/checkout/checkout.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { NewsLetterRoute } from "../modules/newsletter/newsletter.route";

import { CategoryRoutes } from "../modules/category/category.route";

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
  // {
  //   path: "/cart",
  //   route: AddToCartRoutes,
  // },
  {
    path: "/checkout",
    route: CheckoutRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/newsletter',
    route: NewsLetterRoute,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  }


];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;