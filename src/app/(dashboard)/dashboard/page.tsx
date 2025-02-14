import { auth } from "answerwriting/auth";
import DashBoardClient from "answerwriting/components/dashboard";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;
  return <DashBoardClient user={user} />;
}
