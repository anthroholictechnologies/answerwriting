import { AnswerEvaluatorResult } from "answerwriting/components/dashboard/tools/answer-evaluater/answer-evaluator-form";
import { AnswerEvaluatorForm } from "answerwriting/components/dashboard/tools/answer-evaluater/answer-evaluator-result";
import Image from "next/image";

export default async function AnswerEvalTool() {
  return (
    <div className="md:p-8">
      <div className="flex flex-col md:flex-row justify-center items-center gap-2">
        <Image
          src="/logos/1.png"
          height={100}
          width={100}
          alt="answerwriting logo"
          className="w-16 h-16"
        />
        <h1 className="text-primary-dark font-semibold text-3xl tracking-tighter leading-none">
          {" "}
          Answer Evaluator{" "}
        </h1>
      </div>
      <hr className="mt-4" />

      <div className="flex flex-col xl:flex-row mt-4">
        <div className="flex-1 border-r border-white-500">
          <AnswerEvaluatorForm />
        </div>
        <div className="flex-1">
          <AnswerEvaluatorResult />
        </div>
      </div>
    </div>
  );
}
