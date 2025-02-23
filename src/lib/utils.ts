import { Marks, Words } from "answerwriting/types/ai.types";
import { Duration } from "answerwriting/types/payment.types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtmlTags(input: string): string {
  // Using regular expression to remove HTML tags
  return input.replace(/<[^>]*>/g, "");
}

export const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length; // Count words by splitting on whitespace
  const minutes = Math.ceil(words / wordsPerMinute); // Round up to nearest minute

  return minutes;
};

export const getWordsFromMarks = (marks: Marks): Words => {
  switch (marks) {
    case Marks.TEN:
      return Words.ONE_FIFTY;
    case Marks.FIFTEEN:
      return Words.TWO_FIFTY;
    case Marks.TWENTY:
      return Words.THREE_HUNDERED;
  }
};

export const convertPaisaToRupee = (paisa: number): number => {
  return paisa / 100;
};

export const getDurationMonths = (duration: Duration): number => {
  switch (duration) {
    case Duration.ANNUAL:
      return 12;
    case Duration.HALF_YEARLY:
      return 6;
    case Duration.QUATERLY:
      return 3;
    case Duration.MONTHLY:
      return 1;
  }
};
