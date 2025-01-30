import ResetPasswordForm from "answerwriting/components/auth/reset-password-page";

export default async function ResetPasswordPage({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<Record<any, any>>;
}) {
  const params = await searchParams;
  return <ResetPasswordForm userId={await params?.a} token={await params.b} />;
}
