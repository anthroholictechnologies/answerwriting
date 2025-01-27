import { LoginForm } from "answerwriting/components/login-form";
import Image from "next/image";
import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start md:-mt-16 -mt-12">
          <Link href="/">
            <Image
              src="/logos/3.png"
              alt="answerwriting.com logo"
              height={200}
              width={200}
              className="w-[250px] h:[250px] md:w-[200px] md:h-[200px]"
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center md:-mt-8 -mt-32">
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
