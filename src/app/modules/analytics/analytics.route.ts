import { Router } from "express";
import { AnalyticsController, getSmartAnalytics } from "./analytics.controller";
import auth from "../../../middlewares/auth.middleware";
import { USER_ROLE } from "../../../types/user.interface";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  AnalyticsController.getSmartAnalytics,
);

export const AnalyticsRoute = router;
