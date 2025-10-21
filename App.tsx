import React, { useState, useEffect, useMemo } from 'react';
import { PersonData, Transaction, SavingsGoal } from './types';
import { Header } from './components/Header';
import { FinancePanel } from './components/FinancePanel';
import { ActionPanel } from './components/ActionPanel';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { SavingsGoalPanel } from './components/SavingsGoalPanel';

const initialPersonData: PersonData = {
  name: 'Meu Painel',
  transactions: [],
  savingsGoals: [],
};

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [personData, setPersonData] = useState<PersonData>(() => {
    try {
      const savedData = localStorage.getItem('financeData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return {
          name: parsedData.name || 'Meu Painel',
          transactions: parsedData.transactions || [],
          savingsGoals: parsedData.savingsGoals || [],
        };
      }
    } catch (error) {
      console.error("Falha ao carregar dados do localStorage", error);
    }
    return initialPersonData;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(personData));
  }, [personData]);

  const balance = useMemo(() => {
    const income = personData.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = personData.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return income - expense;
  }, [personData.transactions]);

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx-${new Date().getTime()}`,
      date: new Date().toISOString(),
    };
    setPersonData(prevData => ({ ...prevData, transactions: [...prevData.transactions, newTransaction] }));
  };
  
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setPersonData(prevData => ({ ...prevData, transactions: prevData.transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t) }));
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setPersonData(prevData => ({ ...prevData, transactions: prevData.transactions.filter(t => t.id !== transactionId) }));
  };

  const handleNameChange = (newName: string) => {
    setPersonData(prevData => ({ ...prevData, name: newName }));
  };
  
  const handleAddSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
        ...goal,
        id: `sg-${new Date().getTime()}`,
        currentAmount: 0,
    };
    setPersonData(prevData => ({...prevData, savingsGoals: [...prevData.savingsGoals, newGoal] }));
  };

  const handleDepositToSavingsGoal = (goalId: string, amount: number) => {
    const goal = personData.savingsGoals.find(g => g.id === goalId);
    if (!goal) return;

    const newTransaction: Transaction = {
      id: `tx-${new Date().getTime()}`,
      date: new Date().toISOString(),
      description: `Depósito para meta: ${goal.name}`,
      amount: amount,
      type: 'expense',
      category: 'Poupança',
    };

    setPersonData(prevData => {
        const updatedGoals = prevData.savingsGoals.map(sg => 
            sg.id === goalId 
                ? { ...sg, currentAmount: sg.currentAmount + amount } 
                : sg
        );

        return {
            ...prevData,
            transactions: [...prevData.transactions, newTransaction],
            savingsGoals: updatedGoals,
        };
    });
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans transition-colors duration-300">
      <Header currentTheme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <FinancePanel 
              personData={personData} 
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              onNameChange={handleNameChange}
            />
          </div>
        
          <div className="lg:col-span-2 space-y-8">
             <AnalysisDashboard personData={personData} />
             <SavingsGoalPanel 
                savingsGoals={personData.savingsGoals}
                onAddGoal={handleAddSavingsGoal}
                onDepositToGoal={handleDepositToSavingsGoal}
                currentBalance={balance}
             />
             <ActionPanel personData={personData} />
          </div>
        </div>

        <footer className="text-center mt-16 py-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Minhas Contas. Simplificando sua vida financeira.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;