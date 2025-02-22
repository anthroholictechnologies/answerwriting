import { auth } from "answerwriting/auth";
import ContactPage from "answerwriting/components/misc/contact_us";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";

export default async function ContactUs() {
  const session = await auth();
  return (
    <div className="h-screen w-screen">
      <Header isLoggedIn={!!session} />

      <ContactPage />

      <Footer />
    </div>
  );
}
