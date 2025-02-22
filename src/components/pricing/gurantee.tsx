import { CheckIcon, RocketIcon } from "lucide-react";

export default function GuaranteeCard() {
  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-col">
        <div className="p-4 rounded-lg">
          <h3 className="flex gap-2 font-semibold text-lg">
            <CheckIcon className="text-green-400" /> 100% Money-Back Guarantee
          </h3>
          <p className="flex text-sm text-gray-700">
            {`Try Pro for 3 days. If you're not satisfied, get a full refund.`}
          </p>
        </div>
        <div className="p-4 rounded-lg">
          <h3 className="flex gap-2 font-semibold text-lg">
            <RocketIcon className="text-green-400" /> Priority Support for Pro
            Users
          </h3>
          <p className="text-sm text-gray-700">
            Enjoy faster response times and dedicated support to resolve your
            queries efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}
