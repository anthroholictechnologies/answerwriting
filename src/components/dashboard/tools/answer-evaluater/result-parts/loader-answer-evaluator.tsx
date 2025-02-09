import { useEffect, useState } from "react";
import { Upload, Brain, Scale, Sparkles } from "lucide-react";

export const AnswerEvaluatorLoader = () => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalTime = 40000; // 40 seconds in milliseconds

  useEffect(() => {
    const steps = [
      { label: "Uploading your answer...", icon: Upload, duration: 5000 },
      { label: "Analyzing your answer...", icon: Brain, duration: 20000 },
      { label: "Evaluating your answer...", icon: Scale, duration: 10000 },
      {
        label: "Generating a detailed report...",
        icon: Sparkles,
        duration: 10000,
      },
    ];

    let accumulatedTime = 0;

    steps.forEach((_, index) => {
      accumulatedTime += steps[index].duration;
      setTimeout(() => setStep(index + 1), accumulatedTime);
    });

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, totalTime / 100);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    { label: "Uploading your answer...", icon: Upload },
    { label: "Analyzing your answer...", icon: Brain },
    { label: "Evaluating against criteria...", icon: Scale },
    { label: "Generating a detailed report...", icon: Sparkles },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center space-y-8 sm:space-y-12">
          {steps.map((s, index) => (
            <div
              key={index}
              className={`flex items-start sm:items-center space-x-3 sm:space-x-4 w-full max-w-md px-2 sm:px-4 transition-opacity duration-1000 ${
                step >= index ? "opacity-100" : "opacity-30 animate-pulse"
              }`}
            >
              <div className="rounded-full bg-blue-50 p-2 sm:p-3 shrink-0 mt-1 sm:mt-0">
                <s.icon className="w-4 h-4 sm:w-6 sm:h-6 text-primary-dark" />
              </div>
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div className="text-xs sm:text-sm font-medium text-gray-700 text-left">
                  {s.label}
                </div>
                <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full bg-primary-dark rounded-full transition-all duration-700 ${
                      step > index ? "w-full" : step === index ? "w-4/5" : "w-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Progress Bar */}
          <div className="w-full max-w-md px-4">
            <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full">
              <div
                className="h-full bg-primary-dark rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            This may take up to a minute...
          </p>
        </div>
      </div>
    </div>
  );
};
