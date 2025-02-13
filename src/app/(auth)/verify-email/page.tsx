import VerifyEmail from "answerwriting/components/auth/verify-email-page";

export default async function VerifyEmailPage({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<Record<any, any>>;
}) {
  const params = await searchParams;
  return <VerifyEmail userId={await params?.a} token={await params.b} />;
}
