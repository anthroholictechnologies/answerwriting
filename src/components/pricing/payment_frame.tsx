import { ApiRoutePaths } from "answerwriting/types/general.types";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export const PaymentFrame = ({
  redirectUrl,
  onBack,
}: {
  redirectUrl: string;
  onBack: () => void;
}) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Section */}
        <div className="mb-6">
          <Button
            variant="link"
            onClick={onBack}
            className="text-lg text-secondary-dark"
          >
            <ArrowLeft className="w-8 h-4" />
            Back to plans
          </Button>
        </div>

        {/* Main Payment Card */}
        <div className="overflow-hidden">
          {/* Iframe Container */}
          <div className="relative">
            <div className="flex justify-center w-full min-h-[598px]">
              <iframe
                src={redirectUrl}
                className="w-full md:w-[60%] lg:w-[40%] xl:w-[60%] h-full"
                title="PhonePe Payment"
                style={{
                  minHeight: "598px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Having trouble?{" "}
            <Link
              href={ApiRoutePaths.PAGE_CONTACT_US}
              className="text-primary-dark"
            >
              {" "}
              Contact{" "}
            </Link>{" "}
            our support team for assistance
          </p>
        </div>
      </div>
    </div>
  );
};
