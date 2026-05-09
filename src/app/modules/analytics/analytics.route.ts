import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import auth from "../../../middlewares/auth.middleware";
import { USER_ROLE } from "../../../types/user.interface";

const router = Router();

router.get("/", auth(USER_ROLE.ADMIN), AnalyticsController.getAdminAnalytics);
router.get(
  "/staff",
  auth(USER_ROLE.STAFF),
  AnalyticsController.getStaffAnalytics,
);

export const AnalyticsRoute = router;
