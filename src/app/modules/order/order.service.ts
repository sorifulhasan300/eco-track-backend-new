import { prisma } from "../../../lib/prisma";

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
        throw new Error(`Product with ID ${item.productId} not found`);
      if (product.stockLevel < item.quantity) {
        throw new Error(
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

const getAllOrdersFromDB = async () => {
  const orders = await prisma.order.findMany({
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
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

export const OrderServices = {
  createOrderIntoDB,
  getMyOrdersFromDB,
  getAllOrdersFromDB,
};
