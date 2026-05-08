import express from "express";
import { AuthControllers } from "./auth.controller";
import validateRequest from "../../../middlewares/validation.middleware";
import { AuthValidation } from "./auth.validation";
import auth from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.register,
);
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);
router.get("/me", auth(), AuthControllers.getMe);

export const AuthRoutes = router;
