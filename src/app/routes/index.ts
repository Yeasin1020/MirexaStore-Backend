import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BikeRoutes } from "../modules/bike/bike.route";

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: "/bikes",
    route: BikeRoutes
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;