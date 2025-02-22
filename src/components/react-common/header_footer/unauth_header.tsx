import Image from "next/image";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";
import { CommonButton } from "../buttons/button_upgrade";
const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
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
          <CommonButton
            isProUser={false}
            isLoggedIn={isLoggedIn}
            variant="primary"
            customSignUpMessage="Sign Up"
          />
        </div>

        {/* for phone */}
        <div className="flex-1 lg:hidden hover:cursor-pointer px-4 lg:px-12">
          <Image
            src="/logo_1.webp"
            alt="answerwriting logo"
            width={60}
            height={60}
            className="lg:hidden h-[60px] w-[60px]"
          />
        </div>
        <div className="flex lg:hidden items-center px-4">
          <CommonButton
            isProUser={false}
            isLoggedIn={isLoggedIn}
            variant="primary"
            customEvaluationMessage="Evaluate"
            customSignUpMessage="Sign Up"
            customUpgradeMessage="Upgrade"
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
