import { auth } from "answerwriting/auth";
import { ProfilePage } from "answerwriting/components/dashboard/user/me";

export default async function Profile() {
  const session = await auth();
  return <ProfilePage user={session?.user} />;
}
