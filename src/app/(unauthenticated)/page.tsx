import { proUser } from "answerwriting/actions";
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
export default async function Home() {
  const session = await auth();
  const { isProUser } = await proUser(session?.user?.id);
  return (
    <div>
      <Section_1 />
      <Section_2 />
      <Section_3 userDetails={{ isLoggedIn: !!session, isProUser }} />
      <Section_4 />
      <Section_5 userDetails={{ isLoggedIn: !!session, isProUser }} />
      <Section_6 />
      <Section_7 userDetails={{ isLoggedIn: !!session, isProUser }} />
    </div>
  );
}
