import Image from "next/image";

interface SecondarySectionProps {
  title: string;
  highlightedText?: string;
  description: string;
  imageSrc: string;
  ctaButtons: React.ReactNode;
  reverseLayout?: boolean;
  transparentImage?: boolean; // For using a transparent image for the background instead of a solid color.
}

export const SecondarySection = ({
  title,
  highlightedText,
  description,
  imageSrc,
  ctaButtons,
  reverseLayout = false,
  transparentImage = false,
}: SecondarySectionProps) => {
  return (
    <section
      className={`flex flex-col lg:flex-row items-center justify-center mx-auto bg-[#364e8a] px-6 md:px-12 lg:px-20 xl:px-32 py-16 gap-8 lg:gap-16 ${
        reverseLayout ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image Container */}
      <div className="flex-[0.50] flex justify-center max-w-sm md:max-w-[26rem]">
        <div
          className={`${transparentImage ? "" : "bg-white shadow-md rounded-xl"}  overflow-hidden w-full`}
        >
          <Image
            src={imageSrc}
            alt="Feature illustration"
            width={800}
            height={600}
            className="object-contain w-full h-auto"
          />
        </div>
      </div>

      {/* Text & CTA Section */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-lg">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
          {title}{" "}
          {highlightedText && (
            <span className="text-pink-200">{highlightedText}</span>
          )}
        </h1>

        <p className="text-white text-lg lg:text-xl">{description}</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">{ctaButtons}</div>
      </div>
    </section>
  );
};
