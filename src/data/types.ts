export type Level = "junior" | "senior";

export type ChoiceId = "A" | "B" | "C" | "D";

export type Choice = { id: ChoiceId; text: string };

export type Difficulty = "易" | "中" | "難";

export type Question = {
  id: string;
  subjectId: string;
  prompt: string;
  choices: Choice[];
  answer: ChoiceId;
  explanation: string;
  topic: string;
  difficulty: Difficulty;
  source: "past-exam" | "generated";
  sourceRef?: string;
};

export type ReadingLink = { title: string; url: string };

export type StudyTopic = {
  code: string;
  title: string;
  contents: string[];
  links: ReadingLink[];
};

export type SubjectStudyGuide = {
  subjectId: string;
  topics: StudyTopic[];
};
