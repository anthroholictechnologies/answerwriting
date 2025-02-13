import Container from "answerwriting/components/landing/container";
import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="h-screen w-screen overflow-auto">
      <Header />
      <div className="flex flex-col items-center gap-6 py-4 px-2 xl:px-24">
        <Container>
          <>
            <h1 className="text-center text-[3rem] tracking-tighter font-bold">
              About <ImpactSpan text="Us" />
            </h1>
            <Image
              src="/logo_3.webp"
              alt="AnswerWriting logo"
              width={300}
              height={300}
            />
            <div className="flex flex-col gap-6 text-left">
              <p>
                Welcome to <strong>AnswerWriting.com</strong> – your go-to
                platform for mastering the art of answer writing!
              </p>

              <p>
                We understand that <strong>answer writing</strong> is the key to
                success in competitive exams like <strong>UPSC Mains</strong>,
                where structured, well-articulated responses can make all the
                difference. However, getting consistent feedback and improving
                without a mentor can be a challenge. That’s where
                AnswerWriting.com steps in!
              </p>

              <h2 className="text-xl font-semibold mt-4">What We Offer</h2>
              <ul className="list-disc pl-6">
                <li>
                  AI-powered evaluation to provide instant feedback on your
                  answers.
                </li>
                <li>
                  Submit handwritten answers and refine your structure, clarity,
                  and presentation.
                </li>
                <li>
                  Improve answer-writing skills without the need for a teacher.
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-4">Who Is This For?</h2>
              <ul className="list-disc pl-6">
                <li>
                  <strong>UPSC Mains Aspirants:</strong> Enhance writing speed,
                  clarity, and coherence.
                </li>
                <li>
                  <strong>Students preparing for descriptive exams:</strong> Get
                  structured practice.
                </li>
                <li>
                  <strong>Anyone looking to improve writing skills:</strong> Use
                  AI-driven feedback for self-assessment.
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-4">Our Mission</h2>
              <p>
                At AnswerWriting.com, we believe that{" "}
                <strong>consistent practice</strong> and{" "}
                <strong>smart feedback</strong> can transform an average answer
                into a high-scoring one. Our mission is to empower aspirants
                with the right tools to write better, faster, and more
                effectively.
              </p>

              <h2 className="text-xl font-semibold mt-4">
                Created by the Anthroholic Team
              </h2>
              <p>
                This platform is built by the{" "}
                <a
                  href="https://anthroholic.com"
                  className="text-primary-dark hover:underline"
                >
                  Anthroholic Team
                </a>
                , a trusted name among{" "}
                <strong>UPSC Anthropology optional</strong> aspirants. We are
                dedicated to bringing{" "}
                <strong>innovative learning solutions</strong> that make exam
                preparation smarter and more efficient.
              </p>

              <p className="font-semibold text-center mt-6">
                Join us at{" "}
                <a
                  href="https://answerwriting.com"
                  className="text-primary-dark hover:underline"
                >
                  AnswerWriting.com
                </a>{" "}
                and take your answer-writing skills to the next level!
              </p>
            </div>
          </>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
