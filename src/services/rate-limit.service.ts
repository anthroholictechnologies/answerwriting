import { prisma } from "answerwriting/prisma";
import { SubscriptionStatus } from "answerwriting/types/payment.types";
import { DateTime } from "luxon";

export const isRateLimitReached = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      subscription: {
        include: {
          history: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error(`User not found.`);
  }

  const userSubscription = user.subscription;

  if (userSubscription) {
    const status = userSubscription.history?.[0]?.status;
    if (status === SubscriptionStatus.ACTIVE) {
      return false;
    }
  }

  const numberOfAnswersWrittenInLastThirtyDays = await prisma.answer.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: DateTime.now().minus({ days: 30 }).toJSDate(),
      },
    },
  });

  const totalDaysSpentByUser = DateTime.now().diff(
    DateTime.fromJSDate(user.createdAt),
    "days",
  ).days;

  if (totalDaysSpentByUser < 30) {
    if (numberOfAnswersWrittenInLastThirtyDays < 2) {
      return false;
    } else {
      return true;
    }
  } else {
    if (numberOfAnswersWrittenInLastThirtyDays < 1) {
      return false;
    } else {
      return true;
    }
  }
};
