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
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {goal.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-bold text-brand-secondary">
              {formatCurrency(goal.currentAmount)}
            </span>{" "}
            / {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <p className="font-bold text-sm text-brand-primary dark:text-blue-400">
          {progress.toFixed(1)}%
        </p>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 my-2">
        <div
          className="bg-brand-secondary h-2.5 rounded-full"
          style={{ width: `${progress > 100 ? 100 : progress}%` }}
        ></div>
      </div>
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder="Depositar"
          value={depositAmount}
          onChange={handleDepositAmountChange}
          className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary"
        />
        <button
          onClick={handleDeposit}
          className="p-2 bg-brand-secondary text-white rounded-md hover:bg-teal-500"
        >
          <PlusIcon className="h-5 w-5" />
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
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg w-full border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-brand-primary dark:text-blue-400 mb-1 flex items-center gap-2">
        <PiggyBankIcon className="h-6 w-6" /> Meu Cofrinho
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-4">
        Defina e acompanhe suas metas de poupança.
      </p>

      <div className="space-y-4">
        {savingsGoals.map((goal) => (
          <Goal key={goal.id} goal={goal} onDeposit={onDepositToGoal} />
        ))}
      </div>

      {isCreating ? (
        <form
          onSubmit={handleCreateGoal}
          className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg space-y-3"
        >
          <input
            type="text"
            placeholder="Nome da Meta (Ex: Férias)"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
          <input
            type="number"
            placeholder="Valor Alvo"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary"
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="w-full px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full px-3 py-2 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-blue-600"
            >
              Criar Meta
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full mt-4 text-sm font-bold text-brand-primary dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg py-2.5 transition-colors"
        >
          + Adicionar Nova Meta
        </button>
      )}

      <div className="mt-3">
        <button
          onClick={suggestSaveAmount}
          disabled={currentBalance <= 0}
          className="w-full text-sm font-bold text-white bg-brand-secondary rounded-lg py-2.5 transition-colors shadow hover:bg-teal-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          Sugerir quantia para poupar
        </button>

        {suggestionOptions && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sugestões rápidas
              </p>
              <button
                onClick={() => setSuggestionOptions(null)}
                className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700"
              >
                Fechar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {suggestionOptions.map((opt) => (
                <div
                  key={opt.percent}
                  className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border dark:border-gray-700 flex flex-col justify-between min-h-[140px]"
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 truncate">
                        {Math.round(opt.percent * 100)}% do saldo
                      </p>
                      <p className="font-semibold text-lg text-slate-800 dark:text-slate-100 truncate">
                        {formatCurrency(opt.amount)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 ml-2">
                      {opt.amount > 0 ? "Sugestão" : ""}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    Recomendação rápida para sua meta de poupança.
                  </p>
                  <div className="flex gap-2 mt-3 flex-col sm:flex-row">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            formatCurrency(opt.amount)
                          );
                          setToastMessage(
                            `Valor ${formatCurrency(opt.amount)} copiado!`
                          );
                          setTimeout(() => setToastMessage(null), 2000);
                        } catch {}
                      }}
                      className="w-full sm:flex-1 text-sm px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-center"
                      aria-label={`Copiar ${formatCurrency(opt.amount)}`}
                    >
                      Copiar
                    </button>
                    {savingsGoals.length > 0 ? (
                      <button
                        onClick={() => applyToFirstGoal(opt.amount)}
                        className="w-full sm:flex-1 text-sm px-3 py-3 bg-brand-primary text-white rounded hover:bg-blue-600"
                        aria-label={`Aplicar ${formatCurrency(opt.amount)}`}
                      >
                        Aplicar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setGoalName("Minha Meta");
                          setTargetAmount(Math.ceil(opt.amount).toString());
                          setIsCreating(true);
                        }}
                        className="w-full sm:flex-1 text-sm px-3 py-3 bg-brand-primary text-white rounded hover:bg-blue-600"
                        aria-label={`Criar meta com ${formatCurrency(opt.amount)}`}
                      >
                        Criar Meta
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {toastMessage && (
              <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                {toastMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
