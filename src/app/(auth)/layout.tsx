import Image from "next/image";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh xl:grid-cols-2 ">
      <div className="flex flex-col justify-center gap-4 p-10">
        <div className="flex xl:flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted xl:block">
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
