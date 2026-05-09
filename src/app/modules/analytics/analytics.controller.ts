import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/send.response";
import { analyticsService } from "./analytics.service";

export const getAdminAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = analyticsService.getAdminAiAnalyticsFromDB;

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
export const getStaffAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const staffId = req.user.id;
  try {
    const result = analyticsService.getStaffAnalyticsFromDB(staffId);
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
  getAdminAnalytics,
  getStaffAnalytics,
};
