import { Request, Response, NextFunction } from "express";
import { AuthServices } from "./auth.service";
import sendResponse from "../../utils/send.response";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.registerUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.loginUser(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;
    const result = await AuthServices.getMeFromDB(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthControllers = {
  register,
  login,
  getMe,
};
