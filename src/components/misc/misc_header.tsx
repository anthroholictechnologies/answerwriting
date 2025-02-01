import Image from "next/image";
import { Button } from "../ui/button";
import { Gift } from "lucide-react";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
const Header = () => {
  return (
    <header>
      <nav className="flex w-full justify-around py-8 xl:px-24">
        <Link href={ApiRoutePaths.PAGE_HOME} passHref>
          <div className="flex-1 hidden xl:block hover:cursor-pointer">
            <Image
              src="/logos/3_resize.png"
              alt="answerwriting logo"
              width={200}
              height={40}
              className="hidden xl:block h-[40px] w-[200px]"
            />
          </div>
        </Link>
        <div className="items-center justify-end gap-4 flex-1 hidden xl:flex">
          <div className="hidden hover:cursor-pointer h-8 w-8 xl:flex justify-center items-center rounded-full shadow border border-[lightGray]">
            <Gift className="text-primary-dark" />
          </div>
          <Button className="py-5 hover:cursor-pointer"> Learn More </Button>
          <Button variant="transparent" className="py-5 hover:cursor-pointer">
            {" "}
            View Timetable{" "}
          </Button>
        </div>

        {/* for phone */}
        <div className="xl:hidden hover:cursor-pointer">
          <Image
            src="/logos/1.png"
            alt="answerwriting logo"
            width={60}
            height={60}
            className="xl:hidden h-[60px] w-[60px]"
          />
        </div>
        <div className="justify-end gap-1 flex xl:hidden items-center">
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
