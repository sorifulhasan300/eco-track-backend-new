import express from "express";
import { ProductControllers } from "./product.controller";
import { USER_ROLE } from "../../../types/user.interface";
import auth from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validation.middleware";
import { ProductValidations } from "./product.validation";

const router = express.Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.STAFF),
  ProductControllers.getAllProducts,
);
router.get("/:id", ProductControllers.getSingleProduct);

router.post(
  "/create-product",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.STAFF),
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct,
);

router.get(
  "/dashboard-statistics",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  ProductControllers.getDashboardStatsFromDB,
);
export const ProductRoutes = router;
