import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { ProductRoutes } from "../app/modules/product/product.route";
import { SupplierRoutes } from "../app/modules/supplier/supplier.routes";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/product", ProductRoutes);
router.use("/supplier", SupplierRoutes);

export const BaseRouter = router;
