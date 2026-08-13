import type { ChoiceId } from "../types";

/** 一題的手寫詳解與錯誤選項解析。choices 只放錯誤選項，正解不寫。 */
export type QuestionExplanation = {
  explanation: string;
  choices: Partial<Record<ChoiceId, string>>;
};
