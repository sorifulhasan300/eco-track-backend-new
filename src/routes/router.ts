import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { ProductRoutes } from "../app/modules/product/product.route";
import { SupplierRoutes } from "../app/modules/supplier/supplier.routes";
import { OrderRoutes } from "../app/modules/order/order.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/product", ProductRoutes);
router.use("/supplier", SupplierRoutes);
router.use("/order", OrderRoutes);

export const BaseRouter = router;
