import express from "express";
import { ChatControllers } from "./chat.controller";
import auth from "../../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", ChatControllers.handleChat);

export const ChatRoutes = router;
