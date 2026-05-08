import express from "express";
import { SupplierControllers } from "./supplier.controller";
import { USER_ROLE } from "../../../types/user.interface";
import auth from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validation.middleware";
import { SupplierValidations } from "./supplier.validation";

const router = express.Router();

router.get("/", SupplierControllers.getAllSuppliers);
router.get("/:id", SupplierControllers.getSingleSupplier);

router.post(
  "/create-supplier",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validateRequest(SupplierValidations.createSupplierValidationSchema),
  SupplierControllers.createSupplier,
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validateRequest(SupplierValidations.updateSupplierValidationSchema),
  SupplierControllers.updateSupplier,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  SupplierControllers.deleteSupplier,
);

export const SupplierRoutes = router;