'use client';

import { useEffect, useState } from 'react';
import { Plus, Sparkles, Crown, Settings } from 'lucide-react';
import { Habit } from '@/lib/types';
import { storage } from '@/lib/storage';
import { HabitCard } from './components/HabitCard';
import { AddHabitModal } from './components/AddHabitModal';
import { EditHabitModal } from './components/EditHabitModal';
import { HabitHistoryModal } from './components/HabitHistoryModal';
import { StatsOverview } from './components/StatsOverview';
import { ProgressCharts } from './components/ProgressCharts';
import { PremiumBanner } from './components/PremiumBanner';
import { PremiumModal } from './components/PremiumModal';

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userPlan, setUserPlan] = useState(storage.getUserPlan());

  useEffect(() => {
    setHabits(storage.getHabits());
    setUserPlan(storage.getUserPlan());
    setIsLoaded(true);
  }, []);

  const handleUpdate = () => {
    setHabits(storage.getHabits());
    setUserPlan(storage.getUserPlan());
  };

  const handleEdit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsEditModalOpen(true);
  };

  const handleViewHistory = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsHistoryModalOpen(true);
  };

  const handleUpgrade = () => {
    storage.upgradeToPremium();
    setUserPlan(storage.getUserPlan());
    alert('🎉 Bem-vindo ao Premium! Aproveite todos os recursos ilimitados!');
  };

  const togglePlan = () => {
    if (userPlan.type === 'free') {
      setIsPremiumModalOpen(true);
    } else {
      if (confirm('Deseja realmente voltar para o plano gratuito?')) {
        storage.downgradeToFree();
        setUserPlan(storage.getUserPlan());
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-pulse text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Carregando...
        </div>
      </div>
    );
  }

  const isPremium = userPlan.type === 'premium';
  const showPremiumBanner = !isPremium && habits.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Meus Hábitos
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Premium Badge */}
              <button
                onClick={togglePlan}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  isPremium
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">{isPremium ? 'Premium' : 'Upgrade'}</span>
              </button>

              {/* Add Habit Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Novo Hábito</span>
              </button>
            </div>
          </div>

          {/* Plan Info */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>
              {habits.length} de {isPremium ? '∞' : userPlan.habitsLimit} hábitos
            </span>
            {!isPremium && habits.length >= userPlan.habitsLimit && (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                • Limite atingido
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Premium Banner */}
        {showPremiumBanner && (
          <PremiumBanner onUpgrade={() => setIsPremiumModalOpen(true)} />
        )}

        {habits.length > 0 ? (
          <>
            {/* Stats Overview */}
            <StatsOverview habits={habits} />

            {/* Progress Charts */}
            <ProgressCharts habits={habits} />

            {/* Habits List */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Seus Hábitos
              </h2>
              {habits.map((habit) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onUpdate={handleUpdate}
                  onEdit={handleEdit}
                  onViewHistory={handleViewHistory}
                />
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 text-center">
              Comece sua jornada!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md px-4">
              Crie seu primeiro hábito e comece a construir uma rotina incrível
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Hábito
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleUpdate}
      />

      <EditHabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
        habit={selectedHabit}
      />

      <HabitHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        habit={selectedHabit}
        onUpdate={handleUpdate}
      />

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
