import React from "react";
import { Clock, CheckCircle, BarChart } from "lucide-react";
import { Card, CardContent } from "answerwriting/components/ui/card";
import ToolHeading from "answerwriting/components/dashboard/tools/tool-heading";

export default async function WordCounterComingSoon() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6 px-4 md:px-6">
        <ToolHeading heading="Word Counter" />
        {/* Header Section */}
        <div className="text-center py-4">
          <p className="text-lg md:text-xl text-zinc-600">Coming Soon!</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary-dark" />
            <p className="text-sm md:text-base text-zinc-500">
              Launch Expected in March 2025
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card className="border border-primary-dark/20 shadow-sm">
            <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-primary-dark" />
                <h3 className="text-base md:text-lg font-semibold">
                  Precise Word Count
                </h3>
              </div>
              <p className="text-sm md:text-base text-zinc-600">
                Accurate word counting specifically designed for UPSC answer
                writing format, including proper handling of hyphenated words
                and technical terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-primary-dark/20 shadow-sm">
            <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 md:gap-3">
                <BarChart className="h-5 w-5 md:h-6 md:w-6 text-primary-dark" />
                <h3 className="text-base md:text-lg font-semibold">
                  Answer Analysis
                </h3>
              </div>
              <p className="text-sm md:text-base text-zinc-600">
                AI-powered insights on word distribution, paragraph length, and
                structural balance to optimize your answer presentation.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Features List */}
        <div className="text-center mt-8 md:mt-12">
          <h3 className="text-lg md:text-xl font-semibold text-primary-dark mb-3 md:mb-4">
            What to Expect
          </h3>
          <div className="max-w-2xl mx-auto text-sm md:text-base text-zinc-600 space-y-2 px-4">
            <p>✓ Real-time word counting as you type</p>
            <p>✓ UPSC-specific formatting guidelines</p>
            <p>✓ Answer structure recommendations</p>
            <p>✓ Progress tracking across practice sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
