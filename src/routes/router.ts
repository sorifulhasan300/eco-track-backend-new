import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";
import { ProductRoutes } from "../app/modules/product/product.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/product", ProductRoutes);

export const BaseRouter = router;
