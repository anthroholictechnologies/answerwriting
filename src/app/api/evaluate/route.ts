import { evaluateAnswer } from "answerwriting/services/evaluateAnswer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the form data
    const formData = await req.formData();

    // Extract text fields
    const question = formData.get("question")?.toString() || "";
    // const exam = formData.get("exam")?.toString() || "";
    // const subject = formData.get("subject")?.toString() || "";

    // Convert images to Base64 URLs
    const images: string[] = [];
    const fileFields = formData.getAll("images") as File[];

    for (const file of fileFields) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = file.type; // Get the MIME type of the file
      const base64Url = `data:${mimeType};base64,${base64}`;
      images.push(base64Url);
    }

    // Call your function with extracted data
    const result = await evaluateAnswer(question, images);

    // Respond with the result
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error processing form data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process form data" },
      { status: 500 },
    );
  }
}
