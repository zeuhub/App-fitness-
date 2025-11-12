'use client';

import { Habit } from '@/lib/types';
import { TrendingUp, Award, Target } from 'lucide-react';

interface ProgressChartsProps {
  habits: Habit[];
}

export function ProgressCharts({ habits }: ProgressChartsProps) {
  // Calculate last 30 days completion rate
  const getLast30DaysRate = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    let totalPossible = 0;
    let totalCompleted = 0;

    habits.forEach(habit => {
      for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        totalPossible++;
        if (habit.completions[dateStr]) {
          totalCompleted++;
        }
      }
    });

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

  // Get weekly completion data for chart
  const getWeeklyData = () => {
    const weeks = [];
    const today = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7) - 6);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));

      let completed = 0;
      let total = 0;

      habits.forEach(habit => {
        for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          total++;
          if (habit.completions[dateStr]) {
            completed++;
          }
        }
      });

      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      weeks.push({ rate, label: `Sem ${4 - i}` });
    }

    return weeks;
  };

  const last30DaysRate = getLast30DaysRate();
  const weeklyData = getWeeklyData();
  const maxRate = Math.max(...weeklyData.map(w => w.rate), 1);

  // Best performing habit
  const bestHabit = habits.reduce((best, habit) => {
    return habit.streak > (best?.streak || 0) ? habit : best;
  }, habits[0]);

  // Total completions
  const totalCompletions = habits.reduce((sum, habit) => {
    return sum + Object.values(habit.completions).filter(Boolean).length;
  }, 0);

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
        Progresso Geral
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Últimos 30 Dias
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {last30DaysRate}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Taxa de conclusão
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Melhor Hábito
            </span>
          </div>
          {bestHabit ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{bestHabit.icon}</span>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {bestHabit.name}
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {bestHabit.streak} dias de sequência
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Nenhum hábito ainda</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total de Conclusões
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {totalCompletions}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Hábitos completados
          </p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Progresso Semanal
        </h3>
        <div className="flex items-end justify-between gap-3 h-40">
          {weeklyData.map((week, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden relative h-full">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-pink-500 transition-all duration-500 rounded-t-lg"
                  style={{ height: `${(week.rate / maxRate) * 100}%` }}
                >
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <span className="text-xs font-bold text-white">
                      {week.rate}%
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {week.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
