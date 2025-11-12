'use client';

import { X, Crown, Check, Zap, TrendingUp, Bell, Download, Palette, Smartphone } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PremiumModal({ isOpen, onClose, onUpgrade }: PremiumModalProps) {
  if (!isOpen) return null;

  const features = [
    { icon: Zap, title: 'Hábitos Ilimitados', description: 'Crie quantos hábitos quiser sem limites' },
    { icon: Smartphone, title: 'Integrações Automáticas', description: 'Conecte com sensores do celular (passos, sono, etc)' },
    { icon: TrendingUp, title: 'Estatísticas Avançadas', description: 'Análises detalhadas e insights personalizados' },
    { icon: Bell, title: 'Lembretes Personalizados', description: 'Configure notificações para cada hábito' },
    { icon: Download, title: 'Exportar Dados', description: 'Baixe seu progresso em CSV ou PDF' },
    { icon: Palette, title: 'Temas Exclusivos', description: 'Personalize a aparência do app' },
  ];

  const handleUpgrade = () => {
    onUpgrade();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header com Gradiente */}
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-8 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Premium</h2>
              <p className="text-white/90">Maximize seus resultados</p>
            </div>
          </div>

          {/* Preço */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-white">R$ 19,90</span>
              <span className="text-white/80">/mês</span>
            </div>
            <p className="text-white/90 text-sm">Cancele quando quiser • Sem compromisso</p>
          </div>
        </div>

        {/* Features */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            O que você ganha:
          </h3>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold hover:from-amber-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Começar Período de Teste Grátis (7 dias)
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Continuar com Plano Gratuito
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            Após o período de teste, será cobrado R$ 19,90/mês. Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
}
