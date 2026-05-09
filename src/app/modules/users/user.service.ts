import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/app.error";
import QueryBuilder from "../../builder/QueryBuilder";

const getAllUsersFromDB = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilder({}, query)
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate();

  const users = await prisma.user.findMany({
    ...userQuery.modelQuery,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
    },
  });

  const total = await prisma.user.count({
    where: userQuery.modelQuery.where,
  });

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data: users,
  };
  
};

const updateUserRoleAndStatusIntoDB = async (
  adminId: string,
  userId: string,
  payload: { role?: string; status?: string },
) => {
  if (adminId === userId) {
    throw new AppError(400, "Admin cannot change their own role or status");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(payload.role && { role: payload.role as any }),
      ...(payload.status && { status: payload.status as any }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      image: true,
      createdAt: true,
    },
  });

  return updatedUser;
};

export const UserServices = {
  getAllUsersFromDB,
  updateUserRoleAndStatusIntoDB,
};