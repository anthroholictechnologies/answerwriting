import Container from "answerwriting/components/misc/misc_container";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import Link from "next/link";
import Image from "next/image";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { auth } from "answerwriting/auth";

const RPHeading = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-[1.5rem] tracking-tighter font-bold mb-2">{heading}</h2>
  );
};

export default async function RefundPolicy() {
  const session = await auth();
  return (
    <div className="h-screen w-screen">
      <Header isLoggedIn={!!session} />
      <Container>
        <>
          <h1 className="hidden md:block text-center text-[3rem] tracking-tighter font-bold leading-none mb-4">
            Refund <ImpactSpan text="Policy" />
          </h1>

          <h1 className="md:hidden text-center text-[3rem] tracking-tighter font-bold leading-none mb-4">
            <div>Refund</div>
            <div>&</div>
            <ImpactSpan text="Return Policy" />
          </h1>

          <Image
            src="/logo_3.webp"
            alt="Answerwriting logo"
            width={300}
            height={300}
          />

          <div className="flex flex-col gap-8">
            <div>
              <p>
                At AnswerWriting.com, we aim to provide a seamless and effective
                experience for UPSC aspirants. If you are not satisfied with our
                services, we offer a 3-day money-back guarantee for eligible
                users, subject to the terms below.
              </p>
            </div>

            <div>
              <RPHeading heading="1. Refund Eligibility" />
              <ul className="list-disc ml-5">
                <li>Refund requests must be made within 3 days of purchase.</li>
                <li>
                  Users who violate our Terms & Conditions or misuse the
                  platform will not be eligible for a refund.
                </li>
              </ul>
            </div>

            <div>
              <RPHeading heading="2. How to Request a Refund" />
              <p>
                To request a refund, please email us at
                <a
                  href="mailto:info@answerwriting.com"
                  className="text-primary-dark"
                >
                  {" "}
                  info@answerwriting.com
                </a>{" "}
                with:
              </p>
              <ul className="list-disc ml-5">
                <li>Your registered email ID.</li>
                <li>Transaction details.</li>
                <li>Reason for the refund request.</li>
              </ul>
              <p>
                Our team will review your request and notify you of approval or
                rejection. If approved, the refund will be credited within 5-7
                business days via the original payment method.
              </p>
            </div>

            <div>
              <RPHeading heading="3. Late or Missing Refunds" />
              <p>
                If you haven’t received a refund within the expected timeframe:
              </p>
              <ul className="list-disc ml-5">
                <li>Check your bank account.</li>
                <li>
                  Contact your credit card company, as processing times may
                  vary.
                </li>
                <li>Contact your bank for further verification.</li>
              </ul>
              <p>
                If you have done all of the above and still haven’t received
                your refund, please contact us at
                <a
                  href="mailto:info@answerwriting.com"
                  className="text-primary-dark"
                >
                  {" "}
                  info@answerwriting.com
                </a>{" "}
                or visit our
                <Link
                  href={ApiRoutePaths.PAGE_CONTACT_US}
                  className="text-primary-dark"
                >
                  {" "}
                  Contact Us Page
                </Link>
                .
              </p>
            </div>

            <div>
              <RPHeading heading="4. Need Help?" />
              <p>
                For any questions regarding refunds, feel free to reach out to
                us at
                <a
                  href="mailto:info@answerwriting.com"
                  className="text-primary-dark"
                >
                  {" "}
                  info@answerwriting.com
                </a>
                .
              </p>
            </div>

            <div>
              <RPHeading heading="5. Contact Us" />
              <ul className="list-disc ml-5">
                <li>
                  <strong> Email: </strong>
                  <a
                    href="mailto:info@answerwriting.com"
                    className="text-primary-dark"
                  >
                    info@answerwriting.com
                  </a>
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
