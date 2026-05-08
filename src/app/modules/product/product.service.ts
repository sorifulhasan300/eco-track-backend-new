import { Product } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import QueryBuilder from "../../builder/QueryBuilder";
import { generateProductMetadata } from "../../utils/generateAiContent";

const createProductIntoDB = async (userId: string, payload: Product) => {
  try {
    const aiData = await generateProductMetadata(
      payload.title,
      payload.description,
    );

    payload.shortDesc = aiData.shortDesc;
    payload.tags = aiData.tags;
  } catch (error) {
    console.error("AI Generation failed, using defaults:", error);
    payload.shortDesc = payload.description.substring(0, 50);
    payload.tags = [payload.category];
  }
  const result = await prisma.product.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getAllProductsFromDB = async (query: Record<string, any>) => {
  const productQuery = new QueryBuilder({}, query)
    .search(["title", "description", "category"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await prisma.product.findMany({
    ...productQuery.modelQuery,
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  const total = await prisma.product.count({
    where: productQuery.modelQuery.where,
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

const getSingleProductFromDB = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
};

const updateProductIntoDB = async (id: string, payload: Partial<Product>) => {
  const result = await prisma.product.update({
    where: { id },
    data: payload,
    include: { user: { select: { name: true, email: true } } },
  });
  return result;
};


export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
};
