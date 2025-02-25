import { prisma } from "answerwriting/prisma";
import { ApiRoutePaths, ErrorCodes } from "answerwriting/types/general.types";
import { PurchaseRequestPayload } from "answerwriting/types/payment.types";
import { PurchaseInput } from "answerwriting/validations/payment.schema";
import { NextRequest, NextResponse } from "next/server";
import {
  CHECKSUM_ADDER,
  PHONE_PAY_PAYMENT_ENDPOINT,
} from "answerwriting/config";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PurchaseInput;
    const { billingOptionId } = body;

    const billingOption = await prisma.billingOption.findUnique({
      where: { id: billingOptionId },
    });

    if (!billingOption) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid billing option",
          errorCode: ErrorCodes.INVALID_BILLING_OPTIONS,
        },
        { status: 400 },
      );
    }

    // Required env variables
    const merchantId = process.env.PHONE_PAY_MERCHANT_ID;
    const saltKey = process.env.PHONE_PAY_SALT_KEY;
    const saltIndex = process.env.PHONE_PAY_SALT_INDEX;
    const phonePayBaseURI = process.env.PHONE_PAY_BASE_URI;

    if (!merchantId || !saltKey || !saltIndex || !phonePayBaseURI) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required environment variables",
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        },
        { status: 500 },
      );
    }

    // Generate unique transaction ID
    const merchantTransactionId = `MT${Date.now()}`;
    const merchantUserId = `MUID${Date.now()}`;
    const amount = billingOption.totalPrice;
    const redirectUrl = `${process.env.APP_BASE_URI}${ApiRoutePaths.STATUS}?id=${merchantTransactionId}`;
    const callbackUrl = `${process.env.APP_BASE_URI}${ApiRoutePaths.STATUS}id=${merchantTransactionId}`;

    // Construct payload
    const payload: PurchaseRequestPayload = {
      merchantId,
      merchantTransactionId,
      merchantUserId,
      amount,
      redirectUrl,
      callbackUrl,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
      redirectMode: "POST",
    };

    // Convert payload to Base64
    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString(
      "base64",
    );
    const fullUrl = `${payloadBase64}${PHONE_PAY_PAYMENT_ENDPOINT}${saltKey}`;
    const sha256 = crypto.createHash("sha256").update(fullUrl).digest("hex");
    const checkSum = sha256 + CHECKSUM_ADDER + saltIndex;

    // Headers
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checkSum,
      "X-MERCHANT-ID": merchantId, // Added this header
    };

    // Log request for debugging
    console.log("Payload Base64:", payloadBase64);
    console.log("fullUrl:", fullUrl);
    console.log("checkSum", checkSum);
    console.log("Request Headers:", headers);

    // Send request to PhonePe
    const response = await axios.post(
      `${phonePayBaseURI}${PHONE_PAY_PAYMENT_ENDPOINT}`,
      { request: payloadBase64 },
      { headers },
    );

    return NextResponse.json({
      success: true,
      message: "Payment request sent to PhonePe",
      data: response.data,
    });
  } catch (err: unknown) {
    console.error("Error purchasing the plan:", err);
    return NextResponse.json(
      {
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: "Failed Purchase",
        success: false,
      },
      { status: 500 },
    );
  }
}
