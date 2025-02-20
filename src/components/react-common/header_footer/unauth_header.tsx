import Image from "next/image";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { ButtonPrimary } from "../buttons/button_primary";
const Header = () => {
  return (
    <header>
      <nav className="flex w-full lg:justify-around py-4 bg-gray-50 lg:px-24">
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
          <ButtonPrimary styles="px-10"> 💎 Upgrade to Pro </ButtonPrimary>
        </div>

        {/* for phone */}
        <div className="flex-1 lg:hidden hover:cursor-pointer px-4 md:px-12">
          <Image
            src="/logo_1.webp"
            alt="answerwriting logo"
            width={60}
            height={60}
            className="lg:hidden h-[60px] w-[60px]"
          />
        </div>
        <div className="flex-1 gap-1 flex lg:hidden items-center justify-end px-4 md:px-12">
          <ButtonPrimary size="sm">
            {" "}
            💎 Get Pro{" "}
          </ButtonPrimary>
        </div>
      </nav>
    </header>
  );
};

export default Header;
