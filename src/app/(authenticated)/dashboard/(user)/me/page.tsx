import { proUser } from "answerwriting/actions";
import { auth } from "answerwriting/auth";
import { ProfilePage } from "answerwriting/components/dashboard/user/me";

export default async function Profile() {
  const session = await auth();
  const { isProUser, activationDate, expiryDate } = await proUser(
    session?.user.id,
  );
  return (
    <ProfilePage
      user={session?.user}
      userDetails={{
        isProUser,
        activationDate,
        expirationDate: expiryDate,
      }}
    />
  );
}
