import { User } from "next-auth";
import { SectionOne } from "./homepage/section_one";
import { SectionTwo } from "./homepage/section_two";
import { SectionThree } from "./homepage/section_three";
import { SectionFour } from "./homepage/section_four";
import { SectionFive } from "./homepage/section_five";
import { SectionSix } from "./homepage/section_six";
import { SectionSeven } from "./homepage/section_seven";

const LandingHero = ({ user }: { user?: User }) => {
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <SectionThree isLoggedIn={!!user} />
      <SectionFour />
      <SectionFive isLoggedIn={!!user} />
      <SectionSeven />
      <SectionSix isLoggedIn={!!user} />
    </div>
  );
};

export default LandingHero;
