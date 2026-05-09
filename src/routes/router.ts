import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { ProductRoutes } from "../app/modules/product/product.route";
import { SupplierRoutes } from "../app/modules/supplier/supplier.routes";
import { OrderRoutes } from "../app/modules/order/order.route";
import { ChatRoutes } from "../app/modules/chat/chat.route";
import { AnalyticsRoute } from "../app/modules/analytics/analytics.route";
import { UserRoutes } from "../app/modules/users/user.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/product", ProductRoutes);
router.use("/supplier", SupplierRoutes);
router.use("/order", OrderRoutes);
router.use("/chat", ChatRoutes);
router.use("/analytics", AnalyticsRoute);
router.use("/user", UserRoutes);

export const BaseRouter = router;
