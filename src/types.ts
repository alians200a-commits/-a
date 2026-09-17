export interface KeyWord {
  word: string;
  emoji: string;
  breakdown: string[]; // Syllable breakdown, e.g. ["دَا", "دَا"]
  hint?: string;
}

export interface Lesson {
  id: number;
  title: string;
  theme: string;
  focusLetters: string[];
  passage: string[];
  words: KeyWord[];
  icon: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
}

export type ActivityType =
  | 'reading'
  | 'flashcards'
  | 'syllables'
  | 'match'
  | 'unscramble'
  | 'missing_syllable'
  | 'odd_one'
  | 'word_hunt'
  | 'sentence_builder'
  | 'memory_cards'
  | 'vowel_marks'
  | 'long_vowels'
  | 'speed_reading'
  | 'riddle'
  | 'phonetic_spelling'
  | 'word_family'
  | 'completion_award';

export interface ActivityDefinition {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  iconName: string;
}

export interface UserProgress {
  lastLessonId: number;
  lastActivityId: number;
  completedActivities: Record<number, number[]>; // lessonId -> array of completed activity IDs (1..17)
  completedLessons: number[];
  totalStars: number;
  soundEnabled: boolean;
  studyDays: string[]; // YYYY-MM-DD
}
