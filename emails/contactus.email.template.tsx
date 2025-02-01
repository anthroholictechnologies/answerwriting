import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const ContactEmail = ({
  name,
  email,
  phone,
  message,
}: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Contact Us Form Submission</Preview>
      <Body style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            New Contact Us Form Submission
          </Text>
          <Text>
            <strong>Name:</strong> {name}
          </Text>
          <Text>
            <strong>Email:</strong> {email}
          </Text>
          <Text>
            <strong>Phone:</strong> {phone}
          </Text>
          <Text>
            <strong>Message:</strong>
          </Text>
          <Text
            style={{
              backgroundColor: "#f3f4f6",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {message}
          </Text>
          <Text style={{ marginTop: "20px", fontSize: "12px", color: "#888" }}>
            {` This email was sent automatically from your website's contact form.`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmail;
