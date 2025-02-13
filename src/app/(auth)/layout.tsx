import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid h-screen xl:grid-cols-2 border border-gray-200 overflow-hidden">
      {/* Content Section */}
      <div className="flex flex-col justify-center gap-4 p-10 h-screen">
        <div className="flex xl:flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Image Section with Blur Effect */}
      <div className="hidden xl:block relative border-l border-gray-200 h-screen overflow-hidden">
        {/* Clear foreground image */}
        <div className="relative h-full flex items-center justify-center p-8">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden">
            <Image
              src="/auth-image.webp"
              alt="Authentication"
              className="w-full h-full object-cover"
              width={1080}
              height={1080}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
