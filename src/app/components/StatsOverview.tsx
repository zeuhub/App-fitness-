'use client';

import { Habit } from '@/lib/types';
import { Target, TrendingUp, Award, Calendar } from 'lucide-react';

interface StatsOverviewProps {
  habits: Habit[];
}

export function StatsOverview({ habits }: StatsOverviewProps) {
  const totalHabits = habits.length;
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.completions[today]).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const bestStreak = Math.max(...habits.map(h => h.bestStreak), 0);

  const stats = [
    {
      label: 'Hábitos Ativos',
      value: totalHabits,
      icon: Target,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Completos Hoje',
      value: `${completedToday}/${totalHabits}`,
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
    },
    {
      label: 'Streak Total',
      value: totalStreak,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
    {
      label: 'Melhor Streak',
      value: bestStreak,
      icon: Award,
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
