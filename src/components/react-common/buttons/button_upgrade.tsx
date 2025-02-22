"use client";
import { RocketIcon } from "lucide-react";
import { ButtonPrimary } from "./button_primary";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { ButtonSecondary } from "./button_secondary";
import Link from "next/link";

export const CommonButton = ({
  isLoggedIn,
  isProUser,
  variant,
  customEvaluationMessage = "Start evaluating now",
  customSignUpMessage = `Sign Up now, it's Free`,
  customUpgradeMessage = "Upgrade to Pro",
}: {
  isLoggedIn: boolean;
  isProUser: boolean;
  variant: string;
  customEvaluationMessage?: string;
  customSignUpMessage?: string;
  customUpgradeMessage?: string;
}) => {
  if (variant === "primary") {
    if (isLoggedIn) {
      if (isProUser) {
        return (
          <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR}>
            <ButtonPrimary>
              <div className="flex gap-1">{customEvaluationMessage}</div>
            </ButtonPrimary>
          </Link>
        );
      } else {
        return (
          <Link href={ApiRoutePaths.PAGE_UPGRADE}>
            <ButtonPrimary>
              <div className="flex gap-2 items-center">
                <RocketIcon className="h-6 w-6" />
                {customUpgradeMessage}
              </div>
            </ButtonPrimary>
          </Link>
        );
      }
    } else {
      return (
        <Link href={ApiRoutePaths.PAGE_LOGIN}>
          <ButtonPrimary>
            <div className="flex gap-2 items-center">
              <RocketIcon className="h-6 w-6" />
              {customSignUpMessage}
            </div>
          </ButtonPrimary>
        </Link>
      );
    }
  } else {
    if (isLoggedIn) {
      if (isProUser) {
        return (
          <Link href={ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR}>
            <ButtonSecondary>
              <div className="flex gap-1">{customEvaluationMessage}</div>
            </ButtonSecondary>
          </Link>
        );
      } else {
        return (
          <Link href={ApiRoutePaths.PAGE_UPGRADE}>
            <ButtonSecondary>
              <div className="flex gap-2 items-center">
                <RocketIcon className="h-6 w-6" />
                {customUpgradeMessage}
              </div>
            </ButtonSecondary>
          </Link>
        );
      }
    } else {
      return (
        <Link href={ApiRoutePaths.PAGE_LOGIN}>
          <ButtonSecondary>
            <div className="flex gap-2 items-center">
              <RocketIcon className="h-6 w-6" />
              {customSignUpMessage}
            </div>
          </ButtonSecondary>
        </Link>
      );
    }
  }
};
