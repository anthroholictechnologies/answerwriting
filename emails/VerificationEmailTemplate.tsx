import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  COMPANY_NAME,
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS,
  LOGO_BANNER_URI,
} from "answerwriting/config";
import * as React from "react";

interface EmailVerificationProps {
  name: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  name: firstName,
  verificationLink,
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Verify your email for {COMPANY_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img
            src={LOGO_BANNER_URI}
            width="150"
            height="150"
            alt={`${COMPANY_NAME} Logo`}
            style={logo}
          />
        </Section>

        <Section style={contentSection}>
          <Heading style={heading}>Verify Your Email</Heading>

          <Text style={paragraphTop}>Hello {firstName},</Text>

          <Text style={paragraph}>
            Welcome to {COMPANY_NAME}. To activate your account and unlock all
            features, please verify your email address by clicking the button
            below.
          </Text>

          <Section style={buttonWrapper}>
            <Button href={verificationLink} style={button}>
              Confirm Email Address
            </Button>
          </Section>

          <Text style={cautionText}>
            This link will expire in{" "}
            {EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIMEOUT_HOURS} hours for your
            security.
          </Text>

          <Text style={paragraph}>
            {`If you didn't request this email, you can safely ignore it.`}
          </Text>
        </Section>

        <Section style={footerSection}>
          <Text style={footerText}>
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </Text>
          <Text style={footerDisclaimer}>
            Sent with ❤️ from our {COMPANY_NAME} team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#f4f7f9",
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
  margin: "40px auto",
  overflow: "hidden",
};

const headerSection = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const contentSection = {
  padding: "30px",
  textAlign: "center" as const,
};

const heading = {
  color: "#1a2b3b",
  fontSize: "28px",
  fontWeight: "700",
  marginBottom: "20px",
};

const paragraphTop = {
  color: "#2d3748",
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "15px",
};

const paragraph = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "1.6",
  marginBottom: "20px",
};

const buttonWrapper = {
  textAlign: "center" as const,
  marginTop: "25px",
  marginBottom: "25px",
};

const button = {
  backgroundColor: "#5271FF",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "14px 30px",
  transition: "background-color 0.3s ease",
};

const cautionText = {
  color: "#718096",
  fontSize: "14px",
  fontStyle: "italic",
  marginBottom: "20px",
};

const footerSection = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#718096",
  fontSize: "12px",
};

const footerDisclaimer = {
  color: "#a0aec0",
  fontSize: "10px",
  marginTop: "5px",
};
