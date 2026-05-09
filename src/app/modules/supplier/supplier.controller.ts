import { Request, Response, NextFunction } from "express";
import { SupplierServices } from "./supplier.service";
import sendResponse from "../../utils/send.response";

const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await SupplierServices.createSupplierIntoDB(req.body);
    
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Supplier created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await SupplierServices.getAllSuppliersFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Suppliers retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await SupplierServices.getSingleSupplierFromDB(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Supplier retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await SupplierServices.updateSupplierIntoDB(
      id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Supplier updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await SupplierServices.deleteSupplierFromDB(id as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Supplier deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const SupplierControllers = {
  createSupplier,
  getAllSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
};
