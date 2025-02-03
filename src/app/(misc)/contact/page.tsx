import ContactPage from "answerwriting/components/misc/contact_us";
import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";

export default async function ContactUs() {
  return (
    <div className="h-screen w-screen">
      <Header />

      <ContactPage />

      <Footer />
    </div>
  );
}
