"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "./auth";
import { LoginInput } from "./validations/auth.schema";
import { ApiResponse, ApiRoutePaths, ErrorCodes } from "./types/general.types";
import { ContactInput } from "./validations/general.schema";
import { Resend } from "resend";
import ContactEmail from "../emails/contactus.email.template";
import { prisma } from "./prisma";
import {
  Duration,
  Plans,
  PlanType,
  Subscription,
  SubscriptionStatus,
  TransactionStatus,
} from "./types/payment.types";

export const logout = async () => {
  return signOut({ redirectTo: ApiRoutePaths.PAGE_LOGIN });
};
export const signInWithGoogle = async () => {
  return signIn("google", { redirectTo: ApiRoutePaths.PAGE_DASHBOARD });
};

export const signInWithCredentials = async ({
  email,
  password,
}: LoginInput): Promise<ApiResponse> => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (err: unknown) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return {
          success: false,
          errorCode: ErrorCodes.INVALID_CREDENTIALS,
          message: "Incorrect username or password.",
        };
      } else if (err.cause?.err?.message === ErrorCodes.USER_NOT_FOUND) {
        return {
          success: false,
          errorCode: ErrorCodes.USER_NOT_FOUND,
          message: "User not found.",
        };
      } else if (
        err.cause?.err?.message === ErrorCodes.VERIFICATION_EMAIL_PENDING
      ) {
        return {
          success: false,
          errorCode: ErrorCodes.VERIFICATION_EMAIL_PENDING,
          message: "Verification Email Required.",
        };
      } else if (
        err.cause?.err?.message === ErrorCodes.ALREADY_REGISTERED_WITH_GOOGLE
      ) {
        return {
          success: false,
          errorCode: ErrorCodes.ALREADY_REGISTERED_WITH_GOOGLE,
          message: "User already registered with Google.",
        };
      } else {
        return {
          success: false,
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: "Internal server error.",
        };
      }
    } else {
      return {
        success: false,
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Internal server error.",
      };
    }
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);
export const SendContactUsEmail = async (data: ContactInput) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM as string,
      to: process.env.RESEND_EMAIL_FROM as string,
      subject: `📩 New Contact Form Submission from ${data.name}`,
      react: ContactEmail({
        email: data.email,
        message: data.message,
        name: data.name,
        phone: data.phone,
      }),
    });
  } catch (err) {
    console.error(err);
    return {
      success: false,
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Error sending contact us email",
    };
  }
};

export const getPlans = async (): Promise<Plans[]> => {
  const plans = await prisma.plan.findMany({
    include: {
      products: true,
    },
  });

  return plans.map((plan) => {
    return {
      id: plan.id,
      name: plan.name as PlanType,
      products: plan.products.map((bo) => {
        return {
          id: bo.id,
          planId: bo.planId,
          duration: bo.duration as Duration,
          totalPrice: bo.totalPrice,
          discountPercentage: bo.discountPercentage,
        };
      }),
    };
  });
};

export const getUserSubscription = async (
  userId?: string,
): Promise<Subscription | null> => {
  if (!userId) {
    return null;
  }
  const [userSubscription] = await prisma.subscription.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!userSubscription) {
    return null;
  }

  return {
    id: userSubscription.id,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
  };
};

export const proUser = async (
  userId: string,
): Promise<{
  isProUser: boolean;
  hasPendingOrder: boolean;
  transactionId?: string;
}> => {
  if (!userId) return { isProUser: false, hasPendingOrder: false };

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          transaction: {
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
      },
      subscription: {
        include: {
          history: true,
        },
      },
    },
  });

  if (!user) return { isProUser: false, hasPendingOrder: false };

  const latestOrder = user?.orders?.[0];
  const orderStatus = latestOrder?.transaction?.history?.[0]
    ?.status as TransactionStatus;
  const transactionId = latestOrder?.transaction?.id;

  return {
    isProUser:
      user?.subscription?.history?.[0]?.status === SubscriptionStatus.ACTIVE,
    hasPendingOrder: orderStatus === TransactionStatus.PENDING,
    transactionId,
  };
};
