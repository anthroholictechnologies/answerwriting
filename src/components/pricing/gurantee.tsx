export default function GuaranteeCard() {
  return (
    <div className="w-full md:max-w-4xl mx-auto p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">
            ✅ 100% Money-Back Guarantee
          </h3>
          <p className="text-sm text-gray-700">
            {`Try Pro for 3 days. If you're not satisfied, get a full refund.`}
          </p>
        </div>
        <div className="md:w-1/2 p-4 rounded-lg">
          <h3 className="font-semibold text-lg">
            🚀 Priority Support for Pro Users
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
