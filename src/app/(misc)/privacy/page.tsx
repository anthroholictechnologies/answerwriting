import { auth } from "answerwriting/auth";
import Container from "answerwriting/components/misc/misc_container";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import { COMPANY_EMAIL, COMPANY_PHONE_NUMBER } from "answerwriting/config";
import Image from "next/image";
import Link from "next/link";
const PPHeading = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-[1.5rem] tracking-tighter font-bold mb-2">{heading}</h2>
  );
};

export default async function PrivacyPolicy() {
  const session = await auth();
  return (
    <div className="h-screen w-screen">
      <Header isLoggedIn={!!session} />
      <Container>
        <>
          <h1 className="text-center text-[3rem] tracking-tighter font-bold leading-none">
            Privacy <ImpactSpan text="Policy" />
          </h1>

          <Image
            src="/logo_3.webp"
            alt="Answerwriting logo"
            width={300}
            height={300}
          />

          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-bold mb-2"> Effective Date: 20/02/2025 </h1>
              <p>
                Welcome to AnswerWriting.com, a platform dedicated to improving
                answer writing skills through AI-powered evaluation. Your
                privacy is important to us. This Privacy Policy explains how we
                collect, use, and protect your personal information.
              </p>
            </div>

            <div>
              <PPHeading heading="1. Information We Collect" />
              <ul className="list-disc ml-5">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  and other details you provide during registration.
                </li>
                <li>
                  <strong>User-Generated Content:</strong> Handwritten answers
                  and text-based submissions for AI evaluation.
                </li>
                <li>
                  <strong>Usage Data:</strong> Log files, IP addresses, browser
                  type, and interactions with our platform.
                </li>
              </ul>
            </div>

            <div>
              <PPHeading heading="2. How We Use Your Information" />
              <ul className="list-disc ml-5">
                <li>Provide AI-driven answer evaluation and feedback.</li>
                <li>Improve platform performance and user experience.</li>
                <li>
                  Communicate updates, notifications, and promotional offers
                  (only if you opt-in).
                </li>
                <li>Ensure compliance with legal and security obligations.</li>
              </ul>
            </div>

            <div>
              <PPHeading heading="3. Data Security" />
              <p>
                We take reasonable measures to protect your personal data.
                However, no system is completely secure. If you have concerns
                about your data security, please contact us.
              </p>
            </div>

            <div>
              <PPHeading heading="4. Third-Party Services" />
              <p>
                We may use third-party analytics tools, payment gateways, and AI
                models to enhance our services. These third parties may collect
                data as per their policies.
              </p>
            </div>

            <div>
              <PPHeading heading="5. Your Rights & Choices" />
              <ul className="list-disc ml-5">
                <li>
                  You can review, update, or delete your account information by
                  contacting us.
                </li>
                <li>
                  You may opt out of marketing communications at any time.
                </li>
                <li>
                  For any privacy-related requests, reach out to us at{" "}
                  <a
                    href="mailto:info@answerwriting.com"
                    className="text-primary-dark"
                  >
                    info@answerwriting.com
                  </a>
                  .
                </li>
              </ul>
            </div>

            <div>
              <PPHeading heading="6. Changes to This Policy" />
              <p>
                This Privacy Policy may be updated periodically. Any significant
                changes will be communicated via email or a notice on our
                platform.
              </p>
            </div>

            <div>
              <PPHeading heading="7. Contact Us" />
              <p>For any privacy concerns, please reach out to:</p>
              <ul className="list-disc ml-5">
                <li>
                  <strong> Email: </strong>
                  <a
                    href={`mailto:${COMPANY_EMAIL}`}
                    className="text-primary-dark"
                  >
                    {COMPANY_EMAIL}
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong>
                  <Link
                    href={`tel:${COMPANY_PHONE_NUMBER}`}
                    className="text-primary-dark"
                  >
                    {COMPANY_PHONE_NUMBER}
                  </Link>
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
