'use client';

import { Habit } from '@/lib/types';
import { storage, getTodayString, getWeekDates } from '@/lib/storage';
import { Check, Flame, Trash2, Edit2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
  onViewHistory: (habit: Habit) => void;
}

export function HabitCard({ habit, onUpdate, onEdit, onViewHistory }: HabitCardProps) {
  const today = getTodayString();
  const weekDates = getWeekDates();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = (date: string) => {
    storage.toggleCompletion(habit.id, date);
    onUpdate();
  };

  const handleDelete = () => {
    if (isDeleting) {
      storage.deleteHabit(habit.id);
      onUpdate();
    } else {
      setIsDeleting(true);
      setTimeout(() => setIsDeleting(false), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${habit.color}`}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {habit.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">
                {habit.streak} dias
              </span>
              {habit.bestStreak > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  • Recorde: {habit.bestStreak}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewHistory(habit)}
            className="p-2 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
            title="Ver histórico completo"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(habit)}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            title="Editar hábito"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isDeleting 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            title={isDeleting ? 'Clique novamente para confirmar' : 'Deletar hábito'}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Progress */}
      <div className="flex gap-2">
        {weekDates.map((date) => {
          const isCompleted = habit.completions[date];
          const isToday = date === today;
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' });

          return (
            <button
              key={date}
              onClick={() => handleToggle(date)}
              className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 ${
                isCompleted
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                  : isToday
                  ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-purple-300 dark:border-purple-600'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className={`text-xs font-medium uppercase ${
                isCompleted ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {dayName}
              </span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? 'bg-white/20' 
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {isCompleted && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
