export type DigestLayer = 'niche' | 'core-stack' | 'wildcard';

export interface UserProfile {
  name: string;
  stack: string[];
  primaryLanguage: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'staff';
  interests: string[];
  topicMastery: Record<string, number>;
  updatedAt: string;
}

export interface DigestItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  layer: DigestLayer;
  whyItMatters: string;
  topics: string[];
}

export interface Digest {
  date: string;
  items: DigestItem[];
  generatedAt: string;
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export type AdoptionStage = 'Hold' | 'Assess' | 'Trial' | 'Adopt';

export interface DeepDive {
  id: string;
  digestItemId: string;
  title: string;
  whatItIs: string;
  stackRelationship: string;
  codeExamples: CodeExample[];
  adoptionVerdict: { stage: AdoptionStage; reasoning: string };
  generatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Challenge {
  id: string;
  deepDiveId: string;
  title: string;
  questions: QuizQuestion[];
  generatedAt: string;
}

export interface ChallengeSubmission {
  challengeId: string;
  answers: number[];
  score: number;
  total: number;
  submittedAt: string;
}

export interface HistoryEntry {
  id: string;
  digestItemId: string;
  title: string;
  url: string;
  openedAt: string;
}

export interface FavoriteEntry {
  id: string;
  digestItemId: string;
  title: string;
  url: string;
  layer: DigestLayer;
  savedAt: string;
}
