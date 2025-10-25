import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const Header: React.FC<HeaderProps> = ({ currentTheme, toggleTheme, balance }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-accent to-accent-600 rounded-xl flex items-center justify-center shadow-elegant">
              <span className="text-white font-bold text-lg">MC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-brand-primary dark:text-white">
                Minhas Contas
              </h1>
              <p className="text-xs text-brand-secondary dark:text-slate-400">
                Gestão Financeira Inteligente
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => toggleTheme()}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentTheme === "light"
                    ? "bg-white dark:bg-slate-800 text-brand-accent shadow-elegant"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
                aria-label="Modo claro"
              >
                <SunIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleTheme()}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentTheme === "dark"
                    ? "bg-white dark:bg-slate-600 text-brand-accent shadow-elegant"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                }`}
                aria-label="Modo escuro"
              >
                <MoonIcon className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-brand-primary dark:text-white">
                {formatCurrency(balance)}
              </p>
              <p className="text-xs text-brand-secondary dark:text-slate-400">
                Saldo atual
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};