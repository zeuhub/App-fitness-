// Types for Habit Tracker App

export type HabitCategory = 'productivity' | 'health' | 'personal' | 'fitness' | 'mindfulness' | 'learning';

export type IntegrationType = 'steps' | 'sleep' | 'water' | 'exercise' | 'location' | 'screen-time';

export interface Integration {
  type: IntegrationType;
  enabled: boolean;
  autoComplete?: boolean; // Auto-completar hábito quando meta é atingida
  goal?: number; // Meta (ex: 10000 passos, 8 horas de sono)
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  category: HabitCategory;
  createdAt: string;
  completions: Record<string, boolean>; // date string -> completed
  streak: number;
  bestStreak: number;
  isPremium?: boolean; // Hábito requer premium
  integration?: Integration; // Integração com sensores
  notes?: string; // Notas do usuário
  reminder?: string; // Horário do lembrete (HH:MM)
}

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}

export interface UserPlan {
  type: 'free' | 'premium';
  habitsLimit: number;
  features: {
    unlimitedHabits: boolean;
    integrations: boolean;
    advancedStats: boolean;
    customReminders: boolean;
    exportData: boolean;
    themes: boolean;
  };
}

export const FREE_PLAN: UserPlan = {
  type: 'free',
  habitsLimit: 5,
  features: {
    unlimitedHabits: false,
    integrations: false,
    advancedStats: false,
    customReminders: false,
    exportData: false,
    themes: false,
  }
};

export const PREMIUM_PLAN: UserPlan = {
  type: 'premium',
  habitsLimit: Infinity,
  features: {
    unlimitedHabits: true,
    integrations: true,
    advancedStats: true,
    customReminders: true,
    exportData: true,
    themes: true,
  }
};

export const CATEGORY_INFO: Record<HabitCategory, { label: string; icon: string; color: string }> = {
  productivity: { label: 'Produtividade', icon: '💼', color: 'from-blue-500 to-cyan-500' },
  health: { label: 'Saúde', icon: '❤️', color: 'from-red-500 to-pink-500' },
  personal: { label: 'Pessoal', icon: '🌟', color: 'from-purple-500 to-pink-500' },
  fitness: { label: 'Fitness', icon: '💪', color: 'from-orange-500 to-red-500' },
  mindfulness: { label: 'Mindfulness', icon: '🧘', color: 'from-green-500 to-teal-500' },
  learning: { label: 'Aprendizado', icon: '📚', color: 'from-indigo-500 to-purple-500' },
};

export const INTEGRATION_INFO: Record<IntegrationType, { label: string; icon: string; description: string }> = {
  steps: { label: 'Passos', icon: '👟', description: 'Conta passos automaticamente' },
  sleep: { label: 'Sono', icon: '😴', description: 'Monitora qualidade do sono' },
  water: { label: 'Hidratação', icon: '💧', description: 'Rastreia consumo de água' },
  exercise: { label: 'Exercício', icon: '🏃', description: 'Detecta atividades físicas' },
  location: { label: 'Localização', icon: '📍', description: 'Baseado em locais visitados' },
  'screen-time': { label: 'Tempo de Tela', icon: '📱', description: 'Monitora uso do celular' },
};
