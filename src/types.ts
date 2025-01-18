// types.ts
export type Exam = {
  id: string;
  name: string;
  subjects: string[];
};

export type Message = {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  type: string;
};

export interface EvaluationResponse {
  mistakesAndCorrections?:
    | {
        mistake: string;
        correction: string;
      }[]
    | null;
  goodParts?:
    | {
        goodPart: string;
        appreciation: string | null;
      }[]
    | null;
  score: number;
  modelAnswer: string;
}
