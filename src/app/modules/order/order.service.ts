import { prisma } from "../../../lib/prisma";
import AppError from "../../utils/app.error";
import QueryBuilder from "../../builder/QueryBuilder";

const createOrderIntoDB = async (
  userId: string,
  payload: { items: { productId: string; quantity: number }[] },
) => {
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of payload.items) {
      //stock verify
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product)
        throw new AppError(404, `Product with ID ${item.productId} not found`);
      if (product.stockLevel < item.quantity) {
        throw new AppError(
          400,
          `Insufficient stock for ${product.title}. Available: ${product.stockLevel}`,
        );
      }

      // calculate total amount
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // minus stock level
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockLevel: {
            decrement: item.quantity,
          },
        },
      });

      // item ready
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
};

const getMyOrdersFromDB = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

const getAllOrdersFromDB = async (query: Record<string, any>) => {
  const orderQuery = new QueryBuilder({}, query)
    .search(["orderNumber"])
    .filter()
    .sort()
    .paginate();

  const orders = await prisma.order.findMany({
    ...orderQuery.modelQuery,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              category: true,
            },
          },
        },
      },
    },
  });

  const total = await prisma.order.count({
    where: orderQuery.modelQuery.where,
  });

  return {
    meta: {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      total,
    },
    data: orders,
  };
};

const updateOrderStatusIntoDB = async (orderId: string, status: string) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    if (status === "CANCELLED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockLevel: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return updatedOrder;
  });
};

export const OrderServices = {
  createOrderIntoDB,
  getMyOrdersFromDB,
  getAllOrdersFromDB,
  updateOrderStatusIntoDB,
};
