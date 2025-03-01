import { Badge } from "answerwriting/components/ui/badge";
import { Check } from "lucide-react";
import PlanStatusBadge from "./badge-plan-status";
import { UserDetailProp } from "answerwriting/types/general.types";

export const ProfileTab = ({
  name,
  email,
  emailVerified,
  linkedWithGoogle,
  userDetails,
}: {
  name: string;
  email: string;
  emailVerified: boolean;
  linkedWithGoogle: boolean;
  userDetails: UserDetailProp;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="space-y-6">
          <div className="border-b pb-4">
            <label className="block text-sm font-bold mb-1">Name</label>
            <p className="text-secondary-dark">{name}</p>
          </div>
          <div className="border-b pb-4">
            <label className="block text-sm font-bold mb-1">Email</label>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-secondary-dark break-all">{email}</span>
              {emailVerified && (
                <Badge className="bg-green-700 text-white hover:bg-green-700">
                  <Check className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
              {linkedWithGoogle && (
                <Badge className="bg-primary-dark text-white hover:bg-primary-dark">
                  Linked with google
                </Badge>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Current Plan</label>
            <PlanStatusBadge userDetails={userDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};
