import Container from "answerwriting/components/landing/container";
import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import Image from "next/image";
import Link from "next/link";

const PPHeading = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-[1.5rem] tracking-tighter font-bold mb-2">{heading}</h2>
  );
};

const TermsOfService = () => {
  return (
    <Link
      href={ApiRoutePaths.PAGE_TERMS_OF_SERVICE}
      target="_blank"
      className="text-primary-dark"
    >
      Terms of service
    </Link>
  );
};
export default async function PrivacyPolicy() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <Container>
        <>
          <h1 className="text-[3rem] tracking-tighter font-bold mb-4">
            {" "}
            Privacy <ImpactSpan text="Policy" />{" "}
          </h1>

          <Image
            src="/logos/2.png"
            alt="Answerwriting logo"
            width={300}
            height={300}
          />

          <div className="flex flex-col gap-8">
            <div>
              <PPHeading heading="A. General" />
              <p>
                In addition to our <TermsOfService />, Anthroholic respects your
                privacy and is committed to protecting it. This Privacy Policy
                (the “Policy”) explains the types of information collected by
                Anthroholic when you use the Website (as defined in{" "}
                <TermsOfService />) that references this Policy, how we collect,
                use, share and store such information collected and also
                explains the rationale for collection of such information, the
                privacy rights and choices you have regarding your information
                submitted to us when you use the Services.
              </p>
            </div>

            <div>
              <PPHeading heading="B. Applicability" />
              <p>
                This Policy applies to the Website and the Services provided by
                Anthroholic. If you are a customer, a member, or a business
                partner, this Policy also applies to the Services provided by
                Anthroholic, and to any other products or services that
                Anthroholic may offer in the future.
              </p>
            </div>
          </div>
        </>
      </Container>
      <Footer />
    </div>
  );
}
