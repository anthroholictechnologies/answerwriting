import {
  CHECKSUM_ADDER,
  PHONE_PAY_PAYMENT_STATUS_ENDPOINT,
} from "answerwriting/config";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const merchantId = process.env.PHONE_PAY_MERCHANT_ID;
    const saltKey = process.env.PHONE_PAY_SALT_KEY;
    const saltIndex = process.env.PHONE_PAY_SALT_INDEX;
    const phonePayBaseURI = process.env.PHONE_PAY_BASE_URI;

    const searchParams = req.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get("id");

    if (!merchantId || !saltKey || !saltIndex || !phonePayBaseURI) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required environment variables",
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        },
        { status: 500 }
      );
    }

    const fullUrl = `${PHONE_PAY_PAYMENT_STATUS_ENDPOINT}/${merchantId}/${merchantTransactionId}`;
    const sha256 = crypto
      .createHash("sha256")
      .update(fullUrl + saltKey)
      .digest("hex");
    const checkSum = sha256 + CHECKSUM_ADDER + saltIndex;

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checkSum,
      "X-MERCHANT-ID": merchantId, // Added this header
    };

    const resp = (await axios.get(
      `${phonePayBaseURI}${fullUrl}`,
      { headers }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;

    const paymentState = resp.data?.data?.state || "UNKNOWN";
    console.log("📌 Payment state:", paymentState);

    // Redirect based on payment state
    switch (paymentState) {
      case "COMPLETED":
        console.log("✅ Payment successful. Redirecting...");
        return NextResponse.redirect(
          `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=success`,
          { status: 301 }
        );

      case "PENDING":
        console.log("⏳ Payment still processing. Redirecting...");
        return NextResponse.redirect(
          `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=pending`,
          { status: 301 }
        );

      case "FAILED":
      case "DECLINED":
      case "EXPIRED":
      case "CANCELLED":
        console.log("❌ Payment failed. Redirecting...");
        return NextResponse.redirect(
          `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=failure`,
          { status: 301 }
        );

      // case "REFUNDED":
      //   console.log("🔄 Payment refunded. Redirecting...");
      //   return NextResponse.redirect(
      //     `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_REFUND}`,
      //     { status: 301 }
      //   );

      // case "CHARGED_BACK":
        // console.log("🔄 Chargeback initiated. Redirecting...");
        // return NextResponse.redirect(
        //   `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_CHARGEBACK}`,
        //   { status: 301 }
        // );

      default:
        console.log("❓ Unknown state:", paymentState);
        return NextResponse.redirect(
          `${process.env.APP_BASE_URI}${ApiRoutePaths.PAGE_PAYMENT_STATUS}?status=failure`,
          { status: 301 }
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, errorCode: ErrorCodes.INTERNAL_SERVER_ERROR });
  }
}
