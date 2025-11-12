import { Habit, UserPlan, FREE_PLAN, PREMIUM_PLAN } from './types';

const HABITS_KEY = 'habitify_habits';
const USER_PLAN_KEY = 'habitify_user_plan';

// Helper functions
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

export const storage = {
  getHabits(): Habit[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHabits(habits: Habit[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  addHabit(habit: Habit): void {
    const habits = this.getHabits();
    habits.push(habit);
    this.saveHabits(habits);
  },

  updateHabit(updatedHabit: Habit): void {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === updatedHabit.id);
    if (index !== -1) {
      habits[index] = updatedHabit;
      this.saveHabits(habits);
    }
  },

  deleteHabit(id: string): void {
    const habits = this.getHabits();
    const filtered = habits.filter(h => h.id !== id);
    this.saveHabits(filtered);
  },

  getUserPlan(): UserPlan {
    if (typeof window === 'undefined') return FREE_PLAN;
    const data = localStorage.getItem(USER_PLAN_KEY);
    return data ? JSON.parse(data) : FREE_PLAN;
  },

  setUserPlan(plan: UserPlan): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_PLAN_KEY, JSON.stringify(plan));
  },

  upgradeToPremium(): void {
    this.setUserPlan(PREMIUM_PLAN);
  },

  downgradeToFree(): void {
    this.setUserPlan(FREE_PLAN);
  },

  canAddHabit(): boolean {
    const habits = this.getHabits();
    const plan = this.getUserPlan();
    return habits.length < plan.habitsLimit;
  },

  toggleCompletion(habitId: string, date: string): void {
    const habits = this.getHabits();
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return;

    // Toggle completion
    if (habit.completions[date]) {
      delete habit.completions[date];
    } else {
      habit.completions[date] = true;
    }

    // Recalculate streak
    this.updateStreak(habit);
    this.saveHabits(habits);
  },

  updateStreak(habit: Habit): void {
    const today = getTodayString();
    let currentStreak = 0;
    let checkDate = new Date(today);

    // Count consecutive days backwards from today
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (habit.completions[dateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    habit.streak = currentStreak;
    
    // Update best streak
    if (currentStreak > habit.bestStreak) {
      habit.bestStreak = currentStreak;
    }
  },
};
