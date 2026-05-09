import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/send.response";
import { UserServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.getAllUsersFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateUserRoleAndStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminId = req.user.id;
    const userId = req.params.userId as string;
    const { role, status } = req.body;

    const result = await UserServices.updateUserRoleAndStatusIntoDB(
      adminId,
      userId,
      { role, status },
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const UserControllers = {
  getAllUsers,
  updateUserRoleAndStatus,
};