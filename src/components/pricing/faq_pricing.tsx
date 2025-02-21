import { Card, CardContent } from "answerwriting/components/ui/card";
import ImpactSpan from "../react-common/impact-span";

const faqs = [
  {
    question:
      "What is AnswerWriting's 3-day money-back guarantee and how does it work?",
    answer:
      "At AnswerWriting, we guarantee your satisfaction with our services. If you are not satisfied with our services, you may request a refund under our 3-day money-back guarantee if you meet the following requirements:\n\n- You are a new user\n- You have not received a refund from us in the past\n- Your request is made within 3 days of being charged\n\nWe reserve the right to verify information, require valid proof of purchase, and deny guarantee requests at our discretion in cases of suspected fraud, shared accounts, or abuse of the money-back guarantee.",
  },
  {
    question: "What happens if I pause my subscription?",
    answer:
      "If you aren't going to use your Pro subscription for a while, you can go to your Account page and pause it. You won't be billed for that time. No need to cancel.",
  },
  {
    question: "How do I pay for a Pro subscription?",
    answer: "You can pay using UPI, credit/debit card, or net banking.",
  },
  {
    question: "Can I use AnswerWriting Pro on multiple devices?",
    answer: "You can use Pro on all your devices.",
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Frequently Asked <ImpactSpan text="Questions" />
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="border border-gray-200 p-4 sm:p-6 rounded-lg"
          >
            <CardContent>
              <h3 className="text-lg font-bold text-primary-dark mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
