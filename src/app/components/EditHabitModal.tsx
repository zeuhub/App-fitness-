'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Habit } from '@/lib/types';
import { storage } from '@/lib/storage';

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  habit: Habit | null;
}

const HABIT_ICONS = ['💪', '📚', '🏃', '🧘', '💧', '🎨', '✍️', '🎯', '🌱', '🎵', '🍎', '😴'];
const HABIT_COLORS = [
  'bg-gradient-to-br from-purple-400 to-purple-600',
  'bg-gradient-to-br from-pink-400 to-pink-600',
  'bg-gradient-to-br from-blue-400 to-blue-600',
  'bg-gradient-to-br from-green-400 to-green-600',
  'bg-gradient-to-br from-orange-400 to-orange-600',
  'bg-gradient-to-br from-red-400 to-red-600',
  'bg-gradient-to-br from-cyan-400 to-cyan-600',
  'bg-gradient-to-br from-indigo-400 to-indigo-600',
];

export function EditHabitModal({ isOpen, onClose, onUpdate, habit }: EditHabitModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setSelectedIcon(habit.icon);
      setSelectedColor(habit.color);
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    storage.updateHabit(habit.id, {
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });

    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Editar Hábito
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Hábito
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Exercícios, Ler, Meditar..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Escolha um Ícone
            </label>
            <div className="grid grid-cols-6 gap-2">
              {HABIT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 text-2xl rounded-xl transition-all duration-200 ${
                    selectedIcon === icon
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Escolha uma Cor
            </label>
            <div className="grid grid-cols-4 gap-3">
              {HABIT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-12 rounded-xl ${color} transition-all duration-200 ${
                    selectedColor === color
                      ? 'ring-4 ring-purple-300 dark:ring-purple-600 scale-105'
                      : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
