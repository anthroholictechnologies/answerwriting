import { CheckCircle, CreditCard, Loader2, RocketIcon } from "lucide-react";

export const LoadingOverlay = ({
  selectedPlanName,
}: {
  selectedPlanName: string;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <div className="flex flex-col items-center">
        <div className="mb-6 text-primary-dark">
          <RocketIcon size={48} className="animate-bounce" />
        </div>

        <h3 className="text-xl font-bold text-secondary-dark mb-2">
          Setting up your payment
        </h3>

        <p className="text-gray-600 text-center mb-6">
          {`We're preparing your ${selectedPlanName} subscription. Please wait
            while we connect to our payment gateway.`}
        </p>

        <div className="w-full space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary-dark" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Plan selected</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary-dark animate-spin" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">
                Connecting to payment gateway
              </p>
            </div>
          </div>

          <div className="flex items-center opacity-50">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Complete payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);