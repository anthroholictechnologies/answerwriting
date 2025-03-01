import { Card, CardContent } from "answerwriting/components/ui/card";
import {
  ApiRoutePaths,
  UserDetailProp,
} from "answerwriting/types/general.types";
import { Check, RocketIcon } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import { ButtonPrimary } from "answerwriting/components/react-common/buttons/button_primary";
import { ButtonTertiary } from "answerwriting/components/react-common/buttons/button_tertiary";

export const SubscriptionTab = ({
  userDetails,
}: {
  userDetails: UserDetailProp;
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary-dark mb-6">
        Current Plan
      </h2>
      {!userDetails.isProUser && (
        <>
          <div className="bg-white border rounded-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-primary-dark">
                  {"Free"} Plan
                </h3>
                <p className="text-seconadary-dark mt-1">
                  Evaluate <ImpactSpan text="1 answer" /> every month
                </p>
              </div>

              <Link href={ApiRoutePaths.PAGE_UPGRADE}>
                <ButtonPrimary>Upgrade</ButtonPrimary>
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary-dark mb-4">
              Available Plans
            </h3>
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-lg font-medium">Pro Plan</h4>
                    <ul className="mt-2 space-y-2 text-secondary-dark">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Unlimited AI Answer Evaluations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Human Expert Feedback
                      </li>
                    </ul>
                  </div>
                  <Link href={ApiRoutePaths.PAGE_PRICING}>
                    <ButtonTertiary>Pricing</ButtonTertiary>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {userDetails.isProUser && (
        <>
          <div className="bg-white border rounded-lg p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="flex gap-2 text-lg font-bold text-primary-dark">
                  <RocketIcon /> {"Pro"} Plan
                </h3>
                <p className="text-seconadary-dark mt-1">
                  You have <ImpactSpan text="unlimited" /> AI Evaluations{" "}
                </p>
              </div>

              <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR}>
                <ButtonPrimary>Practice</ButtonPrimary>
              </Link>
            </div>
            <ul>
              Expires{" "}
              <li className="flex font-bold items-center gap-2">
                {userDetails.expirationDate &&
                  DateTime.fromJSDate(userDetails.expirationDate).toFormat(
                    "yyyy-MM-dd"
                  )}
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
