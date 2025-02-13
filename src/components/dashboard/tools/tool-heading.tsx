import Image from "next/image";
const ToolHeading = ({ heading }: { heading: string }) => {
  return (
    <div className="flex flex-col md:mt-8 lg:mt-0 lg:flex-row justify-center h-32 items-center gap-1">
      <Image
        src="logo_2.svg"
        height={100}
        width={100}
        alt="answerwriting logo"
        className="w-16 h-16"
      />
      <h1 className="text-primary-dark font-semibold text-3xl tracking-tighter leading-none">
        {heading}
      </h1>
    </div>
  );
};

export default ToolHeading;
