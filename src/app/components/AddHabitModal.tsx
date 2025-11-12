'use client';

import { useState } from 'react';
import { X, Plus, Crown } from 'lucide-react';
import { Habit, HabitCategory, CATEGORY_INFO, IntegrationType, INTEGRATION_INFO } from '@/lib/types';
import { storage } from '@/lib/storage';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const HABIT_ICONS = ['⭐', '🎯', '💪', '📚', '🧘', '💧', '🏃', '🎨', '🎵', '✍️', '🌱', '🔥'];
const HABIT_COLORS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-teal-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState<HabitCategory>('personal');
  const [integration, setIntegration] = useState<IntegrationType | null>(null);
  const [autoComplete, setAutoComplete] = useState(false);
  const [goal, setGoal] = useState('');

  const userPlan = storage.getUserPlan();
  const canAddHabit = storage.canAddHabit();
  const isIntegrationLocked = !userPlan.features.integrations;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAddHabit) {
      alert('Você atingiu o limite de hábitos do plano gratuito. Faça upgrade para Premium!');
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
      color,
      frequency,
      category,
      createdAt: new Date().toISOString(),
      completions: {},
      streak: 0,
      bestStreak: 0,
      isPremium: integration !== null,
      integration: integration ? {
        type: integration,
        enabled: true,
        autoComplete,
        goal: goal ? parseInt(goal) : undefined,
      } : undefined,
    };

    storage.addHabit(newHabit);
    onAdd();
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setIcon(HABIT_ICONS[0]);
    setColor(HABIT_COLORS[0]);
    setFrequency('daily');
    setCategory('personal');
    setIntegration(null);
    setAutoComplete(false);
    setGoal('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Novo Hábito
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Limite de Hábitos */}
          {!canAddHabit && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Limite de hábitos atingido
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Você atingiu o limite de {userPlan.habitsLimit} hábitos do plano gratuito. Faça upgrade para criar hábitos ilimitados!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nome do Hábito
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Meditar 10 minutos"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key as HabitCategory)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    category === key
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{info.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {info.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Ícone
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {HABIT_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`p-3 text-2xl rounded-xl transition-all ${
                    icon === i
                      ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Cor
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-12 rounded-xl bg-gradient-to-r ${c} transition-all ${
                    color === c ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Frequência */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Frequência
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  frequency === 'daily'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-gray-100">Diário</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Todos os dias</div>
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  frequency === 'weekly'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 dark:text-gray-100">Semanal</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Uma vez por semana</div>
              </button>
            </div>
          </div>

          {/* Integrações (Premium) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Integração Automática
              </label>
              {isIntegrationLocked && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Crown className="w-4 h-4" />
                  Premium
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(INTEGRATION_INFO).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => !isIntegrationLocked && setIntegration(integration === key ? null : key as IntegrationType)}
                  disabled={isIntegrationLocked}
                  className={`p-3 rounded-xl border-2 transition-all relative ${
                    integration === key
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  } ${isIntegrationLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isIntegrationLocked && (
                    <Crown className="w-4 h-4 text-amber-500 absolute top-2 right-2" />
                  )}
                  <div className="text-xl mb-1">{info.icon}</div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {info.label}
                  </div>
                </button>
              ))}
            </div>

            {integration && !isIntegrationLocked && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoComplete"
                    checked={autoComplete}
                    onChange={(e) => setAutoComplete(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                  />
                  <label htmlFor="autoComplete" className="text-sm text-gray-700 dark:text-gray-300">
                    Completar automaticamente ao atingir meta
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Meta (opcional)
                  </label>
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Ex: 10000 passos"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canAddHabit}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Hábito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
