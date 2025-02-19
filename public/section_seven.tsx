/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ejaaRV0QTXn
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "answerwriting/components/ui/avatar";

export const SecitonSeven = () => {
  return (
    <section className="w-full py-12 md:py-20 lg:py-28">
      <div className="container grid max-w-6xl gap-8 px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why <ImpactSpan text="aspirants" /> love us
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <Avatar className="h-16 w-16 border">
              <AvatarImage
                src="/testimonial_navdeep.webp"
                alt="Navdeep Yadav"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <blockquote className="flex-1 text-center text-muted-foreground">
              {`"AnswerWriting has completely transformed my UPSC Mains
              preparation. I used to struggle with structuring my answers, but
              the AI feedback helped me refine my writing and improve with every
              attempt. It’s like having a personal mentor available 24/7"!`}
            </blockquote>
            <div className="text-center">
              <div className="font-medium">Navdeep Yadav</div>
              <div className="text-sm text-muted-foreground">UPSC Aspirant</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src="/testimonial_sharad.webp" alt="@username" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <blockquote className="flex-1 text-center text-muted-foreground">
              {`"I always found it difficult to get my answers evaluated on time, which slowed down my preparation. AnswerWriting changed that by providing instant, detailed feedback. Now, I can practice more efficiently and see real improvement in my writing."`}
            </blockquote>
            <div className="text-center">
              <div className="font-medium">Sharad Saxena</div>
              <div className="text-sm text-muted-foreground">UPSC Aspirant</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <blockquote className="flex-1 text-center text-muted-foreground">
              {`As a UPSC teacher, I find this platform to be an invaluable tool for aspirants. The AI evaluation effectively identifies students' weak areas and provides clear, actionable feedback for improvement. It helps them develop more structured, concise, and well-articulated answers, ultimately enhancing their overall writing skills and exam performance`}
            </blockquote>
            <div className="text-center">
              <div className="font-medium">Emily Park</div>
              <div className="text-sm text-muted-foreground">
                Homeowner, San Francisco
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <blockquote className="flex-1 text-center text-muted-foreground">
              &ldquo;The team at Acme Interiors was incredibly helpful and
              responsive throughout the entire design process. I couldn&apos;t
              be happier with the end result.&rdquo;
            </blockquote>
            <div className="text-center">
              <div className="font-medium">David Lee</div>
              <div className="text-sm text-muted-foreground">
                Homeowner, Chicago
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <blockquote className="flex-1 text-center text-muted-foreground">
              &ldquo;Acme Interiors has an incredible eye for design. They
              helped me create a space that is both beautiful and
              functional.&rdquo;
            </blockquote>
            <div className="text-center">
              <div className="font-medium">Sophia Martinez</div>
              <div className="text-sm text-muted-foreground">
                Apartment Dweller, Miami
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-sm transition-all hover:shadow-md">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <blockquote className="flex-1 text-center text-muted-foreground">
              &ldquo;I was blown away by the transformation of my space. Acme
              Interiors truly exceeded my expectations.&rdquo;
            </blockquote>
            <div className="text-center">
              <div className="font-medium">Liam Nguyen</div>
              <div className="text-sm text-muted-foreground">
                Homeowner, Seattle
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
