import React, { useState, useEffect } from 'react';
import { PersonData, Transaction } from './types';
import { Header } from './components/Header';
import { FinancePanel } from './components/FinancePanel';
import { AiAssistant } from './components/AiAssistant';
import { PdfGenerator } from './components/PdfGenerator';

const initialPersonData: PersonData = {
  name: 'Meu Painel',
  transactions: [],
};

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [personData, setPersonData] = useState<PersonData>(() => {
    try {
      const savedData = localStorage.getItem('financeData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Basic validation
        if (parsedData.name && Array.isArray(parsedData.transactions)) {
          return parsedData;
        }
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

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `tx-${new Date().getTime()}`,
      date: new Date().toISOString(),
    };

    setPersonData(prevData => ({
      ...prevData,
      transactions: [...prevData.transactions, newTransaction],
    }));
  };

  const handleNameChange = (newName: string) => {
    setPersonData(prevData => ({
      ...prevData,
      name: newName,
    }));
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-brand-background dark:bg-gray-900 text-brand-text dark:text-gray-200 font-sans transition-colors duration-300">
      <Header currentTheme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Seu Painel Financeiro</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Tudo o que você precisa para tomar controle das suas finanças em um só lugar.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <FinancePanel 
              personData={personData} 
              onAddTransaction={handleAddTransaction}
              onNameChange={handleNameChange}
            />
          </div>
        
          <div className="lg:col-span-2 flex flex-col gap-8">
            <AiAssistant personData={personData} />
            <PdfGenerator personData={personData} />
          </div>
        </div>

        <footer className="text-center mt-16 py-8 border-t dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Minhas Contas. Simplificando sua vida financeira.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
