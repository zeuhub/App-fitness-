'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { Habit } from '@/lib/types';
import { storage } from '@/lib/storage';

interface HabitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onUpdate: () => void;
}

export function HabitHistoryModal({ isOpen, onClose, habit, onUpdate }: HabitHistoryModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen || !habit) return null;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToggleDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    storage.toggleCompletion(habit.id, dateStr);
    onUpdate();
  };

  const isCompleted = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return habit.completions[dateStr] || false;
  };

  // Calculate stats for current month
  const completedDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    .filter(day => isCompleted(day)).length;
  const completionRate = Math.round((completedDays / daysInMonth) * 100);

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isCompleted: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isCompleted: isCompleted(day),
    });
  }

  // Next month days to complete grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isCompleted: false,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${habit.color}`}>
              {habit.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {habit.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Histórico completo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Este Mês
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {completedDays}/{daysInMonth}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Taxa
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {completionRate}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔥</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Sequência
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {habit.streak}
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {monthName}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, index) => (
              <button
                key={index}
                onClick={() => item.isCurrentMonth && handleToggleDay(item.day)}
                disabled={!item.isCurrentMonth}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  !item.isCurrentMonth
                    ? 'text-gray-300 dark:text-gray-600 cursor-default'
                    : item.isCompleted
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {item.day}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Completo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Pendente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
