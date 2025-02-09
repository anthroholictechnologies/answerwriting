import { BookOpen } from "lucide-react";

export const HighlightedText = ({ text }: { text: string }) => {
  if (!text) {
    return null;
  }
  const highlightText = (input: string) => {
    return input.split("\n").map((paragraph, index) => {
      if (!paragraph.trim()) return null; // Skip empty lines

      const highlightedParagraph = paragraph
        .replace(
          /\b(e\.g\.|i\.e\.|etc\.)\b/g,
          '<span class="text-primary-dark font-bold">$1</span>',
        ) // Highlight e.g., i.e., etc.
        .replace(
          /\(([^)]+)\)/g,
          '<span class="text-primary-dark font-semibold">($1)</span>',
        ) // Highlight ( )
        .replace(
          /\b(\d{4})\b/g,
          '<span class="text-primary-dark font-bold">$1</span>',
        ) // Highlight years (2024, 1990, etc.)
        .replace(
          /\[(.*?)\]/g,
          '<span class="italic bg-yellow-200 text-sm rounded-md">[$1]</span>',
        ); // Highlight inline notes `[ ... ]` with a background

      return (
        <p
          key={index}
          className="mb-4 last:mb-0 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
        />
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium text-tertiary">
        <BookOpen className="h-5 w-5" />
        Improved Answer
      </div>
      <div className="prose max-w-none font-semibold text-tertiary bg-accent p-8 rounded-lg">
        {highlightText(text)}
      </div>
    </div>
  );
};

export const ImprovedAnswer = ({ answer }: { answer: string }) => {
  return <HighlightedText text={answer} />;
};
