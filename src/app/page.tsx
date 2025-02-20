import { auth } from "answerwriting/auth";
import { Section_1 } from "answerwriting/components/landing/hero_section";
import {
  Section_3,
  Section_7,
} from "answerwriting/components/landing/render_with_conditions";
import { Section_6 } from "answerwriting/components/landing/testimonials";
import { Section_4 } from "answerwriting/components/landing/with_toons";
import {
  Section_2,
  Section_5,
} from "answerwriting/components/landing/with_violet_bg";
import Footer from "answerwriting/components/react-common/header_footer/unauth_footer";
import Header from "answerwriting/components/react-common/header_footer/unauth_header";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="h-screen w-screen">
      <Header />
      <Section_1 />
      <Section_2 />
      <Section_3 isLoggedIn={!!user} />
      <Section_4 />
      <Section_5 isLoggedIn={!!user} />
      <Section_6 />
      <Section_7 isLoggedIn={!!user} />
      <Footer />
    </div>
  );
}
