import { Request, Response, NextFunction } from "express";
import { getAiAnalyticsFromDB } from "./analytics.service";
import sendResponse from "../../utils/send.response";

export const getSmartAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getAiAnalyticsFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Smart analytics generated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AnalyticsController = {
  getSmartAnalytics,
};
