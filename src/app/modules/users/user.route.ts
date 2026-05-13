import express from "express";
import { UserControllers } from "./user.controller";
import { USER_ROLE } from "../../../types/user.interface";
import auth from "../../../middlewares/auth.middleware";
import validateRequest from "../../../middlewares/validation.middleware";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.get("/all-users", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);

router.patch(
  "/manage/:userId",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUserRoleAndStatus,
);

router.patch(
  "/profile/update",
  auth(),
  validateRequest(UserValidations.updateUserProfileValidationSchema),
  UserControllers.updateUserProfile,
);

export const UserRoutes = router;
