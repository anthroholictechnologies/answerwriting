import LandingHero from "answerwriting/components/landing/landing_hero";
import Footer from "answerwriting/components/misc/misc_footer";
import Header from "answerwriting/components/misc/misc_header";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <LandingHero />
      <Footer />
    </div>
  );
}
