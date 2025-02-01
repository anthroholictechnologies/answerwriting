import AnswerWritingLink from "../react-common/link";
import LoginWithGoogleButton from "../react-common/login-with-google";
import { Button } from "../ui/button";

const AuthFooter = ({
  disabled,
  onClick,
  btnText,
  href,
  linkText,
}: {
  disabled?: boolean;
  onClick: () => void;
  btnText: string;
  href?: string;
  linkText?: string;
  disableContinueWithGoogle?: boolean;
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Button
          type="submit"
          className="w-full md:max-w-[16rem] mx-auto mt-4"
          disabled={disabled}
          onClick={onClick}
        >
          {btnText}
        </Button>

        {/* Divider */}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border p-2">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        {/* Social login button */}
        <LoginWithGoogleButton />
      </div>
      {linkText && href && (
        <p className="text-center text-xs text-muted-foreground">
          {`Don't have an account? `}
          <AnswerWritingLink
            href={href}
            linkText={linkText}
            overrideClasses="underline underline-offset-4 text-xs md:text-sm"
          />
        </p>
      )}
    </>
  );
};

export default AuthFooter;
