import { Request, Response, NextFunction } from "express";
import { ProductServices } from "./product.service";
import sendResponse from "../../utils/send.response";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    const result = await ProductServices.createProductIntoDB(user.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProductServices.getAllProductsFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Products fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ProductServices.getSingleProductFromDB(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardStatsFromDB = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ProductServices.getDashboardStatsFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard statics fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getDashboardStatsFromDB,
};
