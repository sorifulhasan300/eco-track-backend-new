import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/send.response";
import { OrderServices } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const result = await OrderServices.createOrderIntoDB(userId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Order placed successfully and stock updated",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const result = await OrderServices.getMyOrdersFromDB(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OrderServices.getAllOrdersFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All orders retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const OrderControllers = {
  createOrder,
  getMyOrders,
  getAllOrders,
};
