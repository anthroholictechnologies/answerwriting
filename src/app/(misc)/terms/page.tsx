import Container from "answerwriting/components/misc/misc_container";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import Link from "next/link";
import Image from "next/image";
import { auth } from "answerwriting/auth";

const PPHeading = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-[1.5rem] tracking-tighter font-bold mb-2">{heading}</h2>
  );
};

export default async function TermsOfServices() {
  const session = await auth();
  return (
    <div className="h-screen w-screen">
      <Header isLoggedIn={!!session} />
      <Container>
        <>
          <h1 className="text-center text-[3rem] leading-none tracking-tighter font-bold xl:mb-6 mb-2">
            Terms and <ImpactSpan text="Conditions" />
          </h1>

          <Image
            src="/logo_3.webp"
            alt="Answerwriting logo"
            width={300}
            height={300}
          />

          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-bold">Effective Date: 20/02/2025 </h1>
              <p>
                {` Welcome to AnswerWriting.com! These Terms and Conditions ("Terms") govern your use of our platform and services. By accessing or using AnswerWriting.com, you agree to be bound by these Terms.`}
              </p>
            </div>

            <div>
              <PPHeading heading="1. Use of the Platform" />
              <ul className="list-disc pl-6">
                <li>
                  <strong>Purpose:</strong> This platform is designed to help
                  users improve their answer writing skills through AI-powered
                  evaluation.
                </li>
                <li>
                  <strong>User Responsibility:</strong> You are responsible for
                  maintaining the confidentiality of your account credentials
                  and for all activities under your account.
                </li>
              </ul>
            </div>

            <div>
              <PPHeading heading="2. Content & Intellectual Property" />
              <ul className="list-disc pl-6">
                <li>
                  <strong>Ownership:</strong> All content, AI-generated
                  feedback, and materials on AnswerWriting.com are the
                  intellectual property of Anthroholic Technologies Private
                  Limited.
                </li>
                <li>
                  <strong>User-Generated Content:</strong> By submitting answers
                  for evaluation, you grant us a non-exclusive right to analyze
                  and process the content to improve our services.
                </li>
              </ul>
            </div>

            <div>
              <PPHeading heading="3. Payments & Refunds" />
              <ul className="list-disc pl-6">
                <li>
                  Some features of the platform may be paid services. Pricing
                  details will be provided before purchase.{" "}
                  <Link
                    href="https://answerwriting.com/pricing"
                    className="text-primary-dark"
                  >
                    Refer here
                  </Link>
                  .
                </li>
                <li>
                  <strong>No Refund Policy:</strong> Refunds are applicable as
                  per the refund policy.{" "}
                  <Link
                    href="https://answerwriting.com/refunds-returns"
                    className="text-primary-dark"
                  >
                    Learn more
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <div>
              <PPHeading heading="4. Prohibited Activities" />
              <ul className="list-disc pl-6">
                <li>
                  You agree <strong>NOT</strong> to use the platform for any
                  unlawful or unethical purposes.
                </li>
                <li>
                  Sharing or distributing AI-generated feedback for commercial
                  use without permission is prohibited.
                </li>
                <li>
                  Attempting to disrupt or manipulate the AI system or platform
                  functionality is strictly prohibited.
                </li>
              </ul>
            </div>

            <div>
              <PPHeading heading="5. Limitation of Liability" />
              <p>
                We strive to provide accurate and reliable AI-driven feedback,
                but we do not guarantee any specific improvements in exam
                performance.
              </p>
              <p>
                Anthroholic Technologies Private Limited is not liable for any
                direct or indirect damages resulting from the use of this
                platform.
              </p>
            </div>

            <div>
              <PPHeading heading="6. Termination of Access" />
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these Terms or misuse the platform.
              </p>
            </div>

            <div>
              <PPHeading heading="7. Changes to Terms" />
              <p>
                We may update these Terms periodically. Continued use of the
                platform after any updates constitutes acceptance of the revised
                Terms.
              </p>
            </div>

            <div>
              <PPHeading heading="8. Contact Information" />
              <p>For any queries regarding these Terms, reach out to:</p>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Email:</strong>{" "}
                  <Link
                    href="mailto:info@answerwriting.com"
                    className="text-primary-dark"
                  >
                    info@answerwriting.com
                  </Link>
                </li>

                <li>
                  <strong>Phone:</strong> +91 7303290503
                </li>
              </ul>
            </div>
          </div>
        </>
      </Container>
      <Footer />
    </div>
  );
}
