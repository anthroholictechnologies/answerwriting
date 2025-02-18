import { User } from "next-auth";
import { SectionOne } from "./section_one";
import { SectionTwo } from "./section_two";
import { SectionThree } from "./section_three";

const LandingHero = ({ user }: { user?: User }) => {
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <SectionThree isLoggedIn={!!user} />
    </div>
  );
};

export default LandingHero;
