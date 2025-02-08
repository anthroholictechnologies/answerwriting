import React from "react";
import DashboardClient from "answerwriting/components/dashboard";
import { auth } from "answerwriting/auth";

export default async function Dashboard() {
  const session = await auth();
  const user = session?.user;

  return <DashboardClient user={user} />;
}
