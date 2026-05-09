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
    const result = await OrderServices.getMyOrdersFromDB(userId, req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await OrderServices.getAllOrdersFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All orders retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.orderId as string;
    const { status } = req.body;
    const result = await OrderServices.updateOrderStatusIntoDB(orderId, status);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order status updated successfully",
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
  updateOrderStatus,
};
