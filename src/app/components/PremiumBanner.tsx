'use client';

import { Crown, X } from 'lucide-react';
import { useState } from 'react';

interface PremiumBannerProps {
  onUpgrade: () => void;
}

export function PremiumBanner({ onUpgrade }: PremiumBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white rounded-2xl p-6 mb-6 shadow-xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            Desbloqueie Todo o Potencial! 
            <span className="text-2xl">✨</span>
          </h3>
          <p className="text-white/90 text-sm mb-4">
            Hábitos ilimitados • Integrações automáticas • Estatísticas avançadas • Lembretes personalizados
          </p>
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Fazer Upgrade para Premium
          </button>
        </div>
      </div>
    </div>
  );
}
