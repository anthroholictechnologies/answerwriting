import { ApiRoutePaths } from "answerwriting/types/general.types";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  redirect(ApiRoutePaths.PAGE_DASHBOARD_USER_PROFILE)
}
