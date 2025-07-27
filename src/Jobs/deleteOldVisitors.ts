// jobs/deleteOldVisitors.ts

import prisma from "../shared/prismaClient";

export const deleteOldVisitors = async () => {
  const dateLimit = new Date();
  dateLimit.setMonth(dateLimit.getMonth() - 3); // 3 months ago

  const deleted = await prisma.visitor.deleteMany({
    where: {
      createdAt: {
        lt: dateLimit,
      },
    },
  });

  console.log(`Deleted ${deleted.count} old visitor records`);
};
