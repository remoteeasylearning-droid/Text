export type AgeGroup = '6–7 років (1 клас)' | '7–8 років (2 клас)' | '8–9 років (3 клас)' | '9–10 років (4 клас)';

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  badgeColor: string;
}

export interface ReadingTask {
  id: string;
  technique: string;
  title: string;
  skillCategory: string;
  instruction: string;
  taskContent: string;
  teacherAnswer: string;
  isEditing?: boolean;
}

export interface SampleText {
  id: string;
  title: string;
  category: string;
  ageRecommendation: string;
  text: string;
}

export interface MethodologyDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  childExample: string;
  purpose: string;
}
