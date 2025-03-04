import { proUser } from "answerwriting/actions";
import { auth } from "answerwriting/auth";
import DashBoardClient from "answerwriting/components/dashboard";

export default async function Dashboard() {
  const session = await auth();
  const userDetails = await proUser(session?.user?.id);
  const user = session?.user;
  return <DashBoardClient user={user} userDetails={userDetails} />;
}
