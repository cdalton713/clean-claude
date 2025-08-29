export interface CleaningRule {
  name: string;
  description: string;
  apply: (text: string) => string;
}

export interface TextStats {
  lines: number;
  characters: number;
  cleaned: number;
}