import React from "react";
import { RocketIcon, StarIcon } from "lucide-react";
import { DateTime } from "luxon";
import {
  ApiRoutePaths,
  UserDetailProp,
} from "answerwriting/types/general.types";
import { Button } from "answerwriting/components/ui/button";
import Link from "next/link";

const PlanStatusBadge = ({ userDetails }: { userDetails: UserDetailProp }) => {
  if (userDetails.isProUser && userDetails.activationDate) {
    const activationDate = DateTime.fromJSDate(userDetails.activationDate);
    const monthsSince = Math.floor(
      DateTime.now().diff(activationDate, "months").months,
    );

    return (
      <div className="flex items-center gap-2 px-3 py-1 text-secondary-dark rounded-full text-sm font-medium">
        <RocketIcon className="w-4 h-4" />
        <span>Pro Plan</span>
        <span className="px-1.5 py-0.5 rounded-md ml-1 font-bold">
          {monthsSince > 0 ? `since ${monthsSince} months` : "New"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-secondary-dark rounded-full text-sm font-medium">
      <StarIcon className="w-4 h-4" />
      <span>Free Plan</span>
      <Link href={ApiRoutePaths.PAGE_UPGRADE} target="_blank">
        <Button variant="link" className="text-secondary-dark">
          Upgrade
        </Button>
      </Link>
    </div>
  );
};

export default PlanStatusBadge;
