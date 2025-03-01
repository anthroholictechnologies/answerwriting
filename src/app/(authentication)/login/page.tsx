import { LoginForm } from "answerwriting/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<Record<any, any>>;
}) {
  const params = await searchParams;
  return <LoginForm urlError={params.error} />;
}
