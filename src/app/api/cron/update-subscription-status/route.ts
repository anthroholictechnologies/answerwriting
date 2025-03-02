import { prisma } from "answerwriting/prisma";
import { ErrorCodes } from "answerwriting/types/general.types";
import { SubscriptionStatus } from "answerwriting/types/payment.types";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log(`Running cron job for expiring the subscriptions `);
    // Fetch only active subscriptions whose expiryDate has passed
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        history: {
          some: {
            status: SubscriptionStatus.ACTIVE,
          },
        },
        expiryDate: {
          lt: DateTime.utc().toJSDate(),
        },
      },
      select: { id: true },
    });

    console.log(
      `Expiring the subscriptions ${JSON.stringify(expiredSubscriptions)}`,
    );

    // Bulk insert expired statuses
    await prisma.subscriptionHistory.createMany({
      data: expiredSubscriptions.map((sub) => ({
        status: SubscriptionStatus.EXPIRED,
        subscriptionId: sub.id,
      })),
    });

    return NextResponse.json({ success: true, data: expiredSubscriptions });
  } catch (error) {
    console.error("Error updating subscriptions:", error);
    return NextResponse.json(
      {
        error: ErrorCodes.INTERNAL_SERVER_ERROR,
        success: false,
      },
      { status: 500 },
    );
  }
}
