import React, { useState } from "react";
import { SavingsGoal } from "../types";
import { PiggyBankIcon } from "./icons/PiggyBankIcon";
import { PlusIcon } from "./icons/PlusIcon";

interface SavingsGoalPanelProps {
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, "id" | "currentAmount">) => void;
  onDepositToGoal: (goalId: string, amount: number) => void;
  currentBalance: number;
}

const parseAmount = (input: string): number => {
  if (!input) return 0;
  const sanitized = input.replace(/\./g, "").replace(",", ".");
  return parseFloat(sanitized);
};

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", { 
    style: "currency", 
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const Goal: React.FC<{
  goal: SavingsGoal;
  onDeposit: (goalId: string, amount: number) => void;
}> = ({ goal, onDeposit }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const progress =
    goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  const handleDepositAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) {
      setDepositAmount("");
      return;
    }
    const numberValue = Number(rawValue) / 100;
    const formattedValue = numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setDepositAmount(formattedValue);
  };

  const handleDeposit = () => {
    const amount = parseAmount(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      onDeposit(goal.id, amount);
      setDepositAmount("");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-primary-50/80 to-teal-50/80 dark:from-slate-800/90 dark:to-slate-700/90 rounded-xl sm:rounded-2xl border border-primary-200 dark:border-slate-600 shadow-lg backdrop-blur-sm">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-1.5 sm:p-2 bg-primary-500/20 dark:bg-primary-400/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <PiggyBankIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-bold text-sm sm:text-lg text-primary-800 dark:text-primary-200 truncate">
              {goal.name}
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="text-lg sm:text-2xl font-bold text-primary-700 dark:text-primary-300">
              {formatCurrency(goal.currentAmount)}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              de {formatCurrency(goal.targetAmount)}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="px-2 sm:px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <span className="text-xs sm:text-sm font-bold text-primary-700 dark:text-primary-300">
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3 sm:mb-4">
        <div className="w-full bg-primary-100 dark:bg-slate-600 rounded-full h-2 sm:h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-brand-secondary h-2 sm:h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{ width: `${progress > 100 ? 100 : progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        {progress >= 100 && (
          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">
            🎉 Meta alcançada! Parabéns!
          </p>
        )}
      </div>
      
      {/* Deposit Section */}
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-1">
          <input
            type="text"
            inputMode="decimal"
            placeholder="R$ 0,00"
            value={depositAmount}
            onChange={handleDepositAmountChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-primary-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-primary-800 dark:text-primary-200 placeholder-primary-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 transition-all"
          />
        </div>
        <button
          onClick={handleDeposit}
          className="px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-brand-accent to-accent-600 hover:from-accent-700 hover:to-accent-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all shadow-elegant hover:shadow-elegant-lg flex-shrink-0"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline text-sm sm:text-base ml-1">Depositar</span>
        </button>
      </div>
    </div>
  );
};

export const SavingsGoalPanel: React.FC<SavingsGoalPanelProps> = ({
  savingsGoals,
  onAddGoal,
  onDepositToGoal,
  currentBalance,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [suggestionOptions, setSuggestionOptions] = useState<
    { percent: number; amount: number }[] | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (goalName.trim() && !isNaN(amount) && amount > 0) {
      onAddGoal({ name: goalName, targetAmount: amount });
      setGoalName("");
      setTargetAmount("");
      setIsCreating(false);
      setToastMessage("Meta criada com sucesso");
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const suggestSaveAmount = () => {
    if (currentBalance <= 0) {
      alert(
        "Seu saldo está negativo. Tente equilibrar suas contas antes de poupar."
      );
      return;
    }

    const suggestions = [0.05, 0.1, 0.15].map((p) => ({
      percent: p,
      amount: currentBalance * p,
    }));
    setSuggestionOptions(suggestions);
  };

  const applyToFirstGoal = (amount: number) => {
    if (savingsGoals.length === 0) return;
    const goalId = savingsGoals[0].id;
    onDepositToGoal(goalId, Number(amount.toFixed(2)));
    setToastMessage(
      `Depósito de ${formatCurrency(amount)} adicionado à meta ${savingsGoals[0].name}`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-elegant border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-brand-accent to-accent-600 rounded-lg sm:rounded-xl shadow-elegant flex-shrink-0">
          <PiggyBankIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-brand-primary dark:text-white">
            Meu Cofrinho
          </h2>
          <p className="text-xs sm:text-sm text-brand-secondary dark:text-slate-400">
            Defina e acompanhe suas metas de poupança.
          </p>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {savingsGoals.map((goal) => (
          <Goal key={goal.id} goal={goal} onDeposit={onDepositToGoal} />
        ))}
      </div>

      {/* Add New Goal */}
      {isCreating ? (
        <form
          onSubmit={handleCreateGoal}
          className="p-4 sm:p-6 bg-gradient-to-br from-primary-50/50 to-teal-50/50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg sm:rounded-xl border-2 border-dashed border-primary-300 dark:border-slate-500 space-y-3 sm:space-y-4"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-primary-500/20 rounded-lg flex-shrink-0">
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-primary-800 dark:text-primary-200">
              Nova Meta de Poupança
            </h3>
          </div>
          
          <input
            type="text"
            placeholder="Nome da Meta (Ex: Férias, Emergência)"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-primary-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-primary-800 dark:text-primary-200 placeholder-primary-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            required
          />
          <input
            type="number"
            placeholder="Valor Alvo (R$)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-primary-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-primary-800 dark:text-primary-200 placeholder-primary-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            required
          />
          <div className="flex gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-slate-600 rounded-lg sm:rounded-xl hover:bg-primary-200 dark:hover:bg-slate-500 font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary-500 to-brand-secondary hover:from-primary-600 hover:to-teal-600 text-white rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Criar Meta
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full p-3 sm:p-4 bg-gradient-to-r from-primary-500/10 to-brand-secondary/10 hover:from-primary-500/20 hover:to-brand-secondary/20 dark:from-primary-400/10 dark:to-teal-400/10 dark:hover:from-primary-400/20 dark:hover:to-teal-400/20 border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-lg sm:rounded-xl transition-all duration-200 group"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary-500/20 group-hover:bg-primary-500/30 rounded-lg transition-all flex-shrink-0">
              <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="font-semibold text-sm sm:text-base text-primary-700 dark:text-primary-300">
              Adicionar Nova Meta
            </span>
          </div>
        </button>
      )}

      {/* Suggestions Section */}
      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
        <button
          onClick={suggestSaveAmount}
          disabled={currentBalance <= 0}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-brand-success to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-elegant hover:shadow-elegant-lg disabled:shadow-none group"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="p-1 bg-white/20 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
              <PiggyBankIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-sm sm:text-base">Sugerir quantia para poupar</span>
          </div>
        </button>

        {suggestionOptions && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 shadow-elegant">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-brand-primary dark:text-white">
                Sugestões Rápidas
              </h3>
              <button
                onClick={() => setSuggestionOptions(null)}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Fechar
              </button>
            </div>
            
            <div className="grid gap-3 grid-cols-3">
              {suggestionOptions.map((opt) => (
                <div
                  key={opt.percent}
                  className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center"
                >
                  <div className="text-xs text-brand-accent font-medium mb-2">
                    {Math.round(opt.percent * 100)}% do saldo
                  </div>
                  
                  <div className="text-lg font-bold text-brand-primary dark:text-white mb-3">
                    {formatCurrency(opt.amount)}
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(formatCurrency(opt.amount));
                          setToastMessage(`Valor copiado!`);
                          setTimeout(() => setToastMessage(null), 1500);
                        } catch {}
                      }}
                      className="w-full py-1.5 text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
                    >
                      Copiar
                    </button>
                    
                    {savingsGoals.length > 0 ? (
                      <button
                        onClick={() => applyToFirstGoal(opt.amount)}
                        className="w-full py-1.5 text-xs bg-brand-accent text-white rounded hover:bg-accent-600"
                      >
                        Aplicar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setGoalName("Nova Meta");
                          setTargetAmount(Math.ceil(opt.amount).toString());
                          setIsCreating(true);
                          setSuggestionOptions(null);
                        }}
                        className="w-full py-1.5 text-xs bg-brand-success text-white rounded hover:bg-emerald-600"
                      >
                        Criar Meta
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {toastMessage && (
              <div className="mt-3 sm:mt-4 p-3 bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700 rounded-lg">
                <p className="text-xs sm:text-sm text-primary-700 dark:text-primary-300 font-medium">
                  {toastMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
