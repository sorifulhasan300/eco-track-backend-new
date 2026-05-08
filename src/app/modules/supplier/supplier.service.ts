import { Supplier, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../utils/app.error";

const createSupplierIntoDB = async (payload: Supplier) => {
  // Check if supplier with this email already exists
  const existingSupplier = await prisma.supplier.findUnique({
    where: { email: payload.email },
  });

  if (existingSupplier) {
    throw new AppError(400, "Supplier already exists with this email");
  }

  const result = await prisma.supplier.create({
    data: payload,
  });

  return result;
};

const getAllSuppliersFromDB = async (query: Record<string, any>) => {
  const supplierQuery = new QueryBuilder({}, query)
    .search(["name", "email", "category", "contact"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await prisma.supplier.findMany({
    ...supplierQuery.modelQuery,
    include: {
      products: {
        select: {
          id: true,
          title: true,
          stockLevel: true,
        },
      },
    },
  });

  const total = await prisma.supplier.count({
    where: supplierQuery.modelQuery.where,
  });

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data: result,
  };
};

const getSingleSupplierFromDB = async (id: string) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: {
        select: {
          id: true,
          title: true,
          price: true,
          stockLevel: true,
          category: true,
        },
      },
    },
  });

  if (!supplier) {
    throw new AppError(404, "Supplier not found");
  }

  return supplier;
};

const updateSupplierIntoDB = async (id: string, payload: Supplier) => {
  // Check if supplier exists
  const existingSupplier = await prisma.supplier.findUnique({
    where: { id },
  });

  if (!existingSupplier) {
    throw new AppError(404, "Supplier not found");
  }

  // Check if email is being updated and if it's already taken
  if (payload.email && payload.email !== existingSupplier.email) {
    const emailExists = await prisma.supplier.findUnique({
      where: { email: payload.email },
    });

    if (emailExists) {
      throw new AppError(400, "Supplier already exists with this email");
    }
  }

  const result = await prisma.supplier.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteSupplierFromDB = async (id: string) => {
  // Check if supplier exists
  const existingSupplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true },
      },
    },
  });

  if (!existingSupplier) {
    throw new AppError(404, "Supplier not found");
  }

  // Check if supplier has associated products
  if (existingSupplier.products.length > 0) {
    throw new AppError(400, "Cannot delete supplier with associated products");
  }

  const result = await prisma.supplier.delete({
    where: { id },
  });

  return result;
};

export const SupplierServices = {
  createSupplierIntoDB,
  getAllSuppliersFromDB,
  getSingleSupplierFromDB,
  updateSupplierIntoDB,
  deleteSupplierFromDB,
};
