import { auth } from "answerwriting/auth";
import LandingHero from "answerwriting/components/landing/landing_hero";
import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";

export default async function Home() {
  const session = await auth()
  const user = session?.user
  return (
    <div className="h-screen w-screen">
      <Header />
      <LandingHero user={user}/>
      <Footer />
    </div>
  );
}
