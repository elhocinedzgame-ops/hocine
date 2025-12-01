export enum Difficulty {
  Basic = 'Basic',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum Topic {
  Academic = 'Academic / Task 1',
  Education = 'Education',
  Environment = 'Environment',
  Technology = 'Technology',
  Society = 'Society',
  Work = 'Work',
  Health = 'Health',
  Government = 'Government & Law',
  Culture = 'Culture & Media',
  Economy = 'Economy & Business',
  General = 'General / Abstract',
}

export enum WordStatus {
  New = 'New',
  Learning = 'Learning',
  Learned = 'Learned',
  FixMistakes = 'Fix Mistakes',
}

export interface Word {
  id: string;
  english: string;
  arabic: string;
  example: string;
  synonyms: string[];
  difficulty: Difficulty;
  topic: Topic;
}

export interface UserProgress {
  wordId: string;
  status: WordStatus;
  interval: number; // Days until next review
  reviews: number;
  lastReviewDate: number | null; // Timestamp
  nextReviewDate: number; // Timestamp
  mistakes: number;
}

export interface AppState {
  words: Word[];
  progress: Record<string, UserProgress>;
}

export interface FilterState {
  difficulty: Difficulty | 'All';
  topic: Topic | 'All';
}