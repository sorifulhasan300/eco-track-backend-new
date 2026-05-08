import { Request, Response, NextFunction } from "express";
import { ChatServices } from "./chat.service";
import sendResponse from "../../utils/send.response";

const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;
    const result = await ChatServices.chatWithInventory(message);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "AI Assistant responded",
      data: result,
    });
  } catch (error: any) {
    if (
      error?.message?.includes("503") ||
      error?.message?.includes("Service Unavailable")
    ) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message:
          "AI analytics service is temporarily unavailable due to high demand. Please try again in a few minutes.",
        data: null,
      });
      return;
    }
    next(error);
  }
};

export const ChatControllers = {
  handleChat,
};
