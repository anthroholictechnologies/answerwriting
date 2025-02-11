import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
});

export const uploadFile = async ({
  filePath,
  fileBuffer,
  contentType,
}: {
  filePath: string;
  fileBuffer: Buffer;
  contentType: string;
}) => {
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET!,
        Key: filePath,
        Body: fileBuffer,
        ContentType: contentType,
      }),
    );

    return getFileUrl(filePath); // Return the public URL of the file
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};

// Generate a public URL for the uploaded file
export const getFileUrl = (filePath: string): string => {
  return `https://${process.env.AWS_BUCKET!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${filePath}`;
};
