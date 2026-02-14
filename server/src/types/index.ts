// ─── Profile ───
export interface UserProfile {
  name: string;
  stack: string[];
  primaryLanguage: string;
  experienceLevel: 'junior' | 'mid' | 'senior' | 'staff';
  interests: string[];
  topicMastery: Record<string, number>; // topic → 0-100
  updatedAt: string;
}

// ─── Digest ───
export type DigestLayer = 'niche' | 'core-stack' | 'wildcard';

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
  date: string; // YYYY-MM-DD
  items: DigestItem[];
  generatedAt: string;
}

// ─── Deep Dive ───
export interface DeepDive {
  id: string;
  digestItemId: string;
  title: string;
  whatItIs: string;
  stackRelationship: string;
  codeExamples: CodeExample[];
  adoptionVerdict: AdoptionVerdict;
  generatedAt: string;
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export type AdoptionStage = 'Hold' | 'Assess' | 'Trial' | 'Adopt';

export interface AdoptionVerdict {
  stage: AdoptionStage;
  reasoning: string;
}

// ─── Challenge ───
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

// ─── History ───
export interface HistoryEntry {
  id: string;
  digestItemId: string;
  title: string;
  url: string;
  openedAt: string;
}

// ─── Favorites ───
export interface FavoriteEntry {
  id: string;
  digestItemId: string;
  title: string;
  url: string;
  layer: DigestLayer;
  savedAt: string;
}
