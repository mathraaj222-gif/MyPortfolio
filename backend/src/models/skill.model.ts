export interface ISkill {
  id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Data Analytics'; // Strict union types prevent typo errors
  proficiency_level?: number; // Optional metric scale 1-5
  created_at?: string;
}