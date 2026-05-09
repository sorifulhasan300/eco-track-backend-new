import express from "express";
import { OrderControllers } from "./order.controller";
import { USER_ROLE } from "../../../types/user.interface";
import auth from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validation.middleware";
import { OrderValidations } from "./order.validation";

const router = express.Router();

router.post(
  "/create",
  auth(USER_ROLE.MANAGER, USER_ROLE.ADMIN, USER_ROLE.STAFF),
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get(
  "/my-orders",
  auth(USER_ROLE.ADMIN, USER_ROLE.ADMIN, USER_ROLE.STAFF),
  OrderControllers.getMyOrders,
);

router.get(
  "/all-orders",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.STAFF),
  OrderControllers.getAllOrders,
);

router.patch(
  "/:orderId/status",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validateRequest(OrderValidations.updateOrderStatusValidationSchema),
  OrderControllers.updateOrderStatus,
);

export const OrderRoutes = router;
