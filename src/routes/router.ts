import { Router } from "express";
import { AuthRoutes } from "../app/modules/auth/auth.route";

const router = Router();

router.use("/auth", AuthRoutes);

export const BaseRouter = router;
