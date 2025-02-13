import Image from "next/image";
import { Button } from "../ui/button";
import { Gift } from "lucide-react";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
const Header = () => {
  return (
    <header>
      <nav className="flex w-full lg:justify-around pt-8 pb-4 lg:px-24">
        <Link href={ApiRoutePaths.PAGE_HOME} passHref>
          <div className="flex-1 hidden lg:block hover:cursor-pointer">
            <Image
              src="/logo_4.svg"
              alt="answerwriting logo"
              width={200}
              height={40}
              className="hidden lg:block h-[40px] w-[200px]"
            />
          </div>
        </Link>
        <div className="items-center justify-end gap-4 flex-1 hidden lg:flex">
          <div className="hidden hover:cursor-pointer h-8 w-8 lg:flex justify-center items-center rounded-full shadow border border-[lightGray]">
            <Gift className="text-primary-dark" />
          </div>
          <Button size="lg" className="py-5 hover:cursor-pointer">
            {" "}
            Learn More{" "}
          </Button>
          <Button
            size="lg"
            variant="transparent"
            className="py-5 hover:cursor-pointer"
          >
            {" "}
            View Timetable{" "}
          </Button>
        </div>

        {/* for phone */}
        <div className="flex-1 lg:hidden hover:cursor-pointer px-4 md:px-12">
          <Image
            src="/logo_2.svg"
            alt="answerwriting logo"
            width={60}
            height={60}
            className="lg:hidden h-[60px] w-[60px]"
          />
        </div>
        <div className="flex-1 gap-1 flex lg:hidden items-center justify-end px-4 md:px-12">
          <Button size="sm" className="hover:cursor-pointer">
            {" "}
            Learn More{" "}
          </Button>
          <Button
            size="sm"
            variant="transparent"
            className="hover:cursor-pointer"
          >
            {" "}
            View Timetable{" "}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
