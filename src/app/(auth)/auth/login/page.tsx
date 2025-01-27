import { LoginForm } from "answerwriting/components/login-form";
import ImpactSpan from "answerwriting/components/react-common/impact-span";
import Image from "next/image";
import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-12 p-6 md:p-10">
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/">
            <Image
              src="/logos/3_resize.png"
              alt="answerwriting.com logo"
              height={50}
              width={300}
              className="w-[300px] h-[50px] md:w-[200px] md:h-[40px]"
            />
          </Link>
          <div className="text-center md:hidden text-xs italic">
            Craft <ImpactSpan text="Better Answers" /> with AI Precision
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1737535614450-ce142f8e2953?q=80&w=1588&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          height={10}
          width={10}
        />
      </div>
    </div>
  );
}
