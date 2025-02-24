import ImpactSpan from "answerwriting/components/react-common/impact-span";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "answerwriting/components/ui/avatar";

const testimonials = [
  {
    name: "Navdeep Yadav",
    role: "UPSC Aspirant",
    image: "/testimonial_navdeep.webp",
    fallback: "NY",
    quote:
      "AnswerWriting has completely transformed my UPSC Mains preparation. I used to struggle with structuring my answers, but the AI feedback helped me refine my writing and improve with every attempt. It’s like having a personal mentor available 24/7!",
  },
  {
    name: "Sharad Saxena",
    role: "UPSC Aspirant",
    image: "/testimonial_sharad.webp",
    fallback: "SS",
    quote:
      "I always found it difficult to get my answers evaluated on time, which slowed down my preparation. AnswerWriting changed that by providing instant, detailed feedback. Now, I can practice more efficiently and see real improvement in my writing.",
  },
  {
    name: "Ashima Shukla",
    role: "UPSC Teacher",
    image: "/testimonial_ashima.webp",
    fallback: "AS",
    quote:
      "As a UPSC teacher, I find this platform to be an invaluable tool for aspirants. The AI evaluation effectively identifies students' weak areas and provides clear, actionable feedback for improvement. It helps them develop more structured, concise, and well-articulated answers, ultimately enhancing their overall writing skills and exam performance.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestimonialCard = ({ name, role, image, fallback, quote }: any) => (
  <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
    <Avatar className="h-16 w-16 border">
      <AvatarImage src={image} alt={name} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
    <blockquote className="flex-1 text-center text-muted-foreground">{`"${quote}"`}</blockquote>
    <div className="text-center">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">{role}</div>
    </div>
  </div>
);

export const Section_6 = () => {
  return (
    <section className="w-full pt-12 md:pt-20 lg:pt-28">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why <ImpactSpan text="aspirants" /> love us
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};
