import { prisma } from "answerwriting/prisma";
import { ErrorCodes } from "answerwriting/types/general.types";
import { SubscriptionStatus } from "answerwriting/types/payment.types";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(`Running cron job for expiring the subscriptions `);
    // Fetch only active subscriptions whose expiryDate has passed
    const allSubscriptions = await prisma.subscription.findMany({
      include: {
        history: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const allActiveSubscriptions = allSubscriptions.filter((sub) => {
      const status = sub.history[0].status;
      return status === SubscriptionStatus.ACTIVE;
    });

    const expiryDatePassed = allActiveSubscriptions.filter((sub) => {
      if (sub.expiryDate) {
        return (
          DateTime.fromJSDate(sub.expiryDate).toMillis() <
          DateTime.utc().toMillis()
        );
      }

      return false;
    });

    console.log(
      `Expiring the subscriptions ${JSON.stringify(expiryDatePassed)}`
    );

    // Bulk insert expired statuses
    await prisma.subscriptionHistory.createMany({
      data: expiryDatePassed.map((sub) => ({
        status: SubscriptionStatus.EXPIRED,
        subscriptionId: sub.id,
      })),
    });

    return NextResponse.json({ success: true, data: expiryDatePassed });
  } catch (error) {
    console.error("Error updating subscriptions:", error);
    return NextResponse.json(
      {
        error: ErrorCodes.INTERNAL_SERVER_ERROR,
        success: false,
      },
      { status: 500 }
    );
  }
}
