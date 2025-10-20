import React, { useState, useMemo } from 'react';
import { PersonData, Transaction } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { TagIcon } from './icons/TagIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ArrowUpCircleIcon } from './icons/ArrowUpCircleIcon';
import { ArrowDownCircleIcon } from './icons/ArrowDownCircleIcon';
import { ScaleIcon } from './icons/ScaleIcon';


interface FinancePanelProps {
  personData: PersonData;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onNameChange: (newName: string) => void;
}

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isOverdue = useMemo(() => {
    if (transaction.type !== 'expense' || !transaction.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only
    return new Date(transaction.dueDate) < today;
  }, [transaction.dueDate, transaction.type]);
  
  const isIncome = transaction.type === 'income';
  
  return (
     <li className={`flex justify-between items-center p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
        isIncome 
        ? 'bg-green-50 dark:bg-green-900/30 border-green-500' 
        : 'bg-red-50 dark:bg-red-900/30 border-red-500'
      }`}>
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{transaction.description}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.category}</p>
        {transaction.dueDate && (
          <div className={`flex items-center mt-1 text-xs ${isOverdue ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
            <CalendarIcon className="h-4 w-4 mr-1.5" />
            <span>Vencimento: {new Date(transaction.dueDate).toLocaleDateString('pt-BR')}</span>
            {isOverdue && <span className="ml-2 text-xs font-semibold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Vencida</span>}
          </div>
        )}
      </div>
      <span className={`font-bold text-lg ml-4 whitespace-nowrap ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isIncome ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
      </span>
    </li>
  );
};

export const FinancePanel: React.FC<FinancePanelProps> = ({ personData, onAddTransaction, onNameChange }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [dueDate, setDueDate] = useState('');
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');

  const { income, expense, balance } = useMemo(() => {
    const income = personData.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = personData.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [personData.transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    const transactionData: Omit<Transaction, 'id' | 'date'> = { 
      description, 
      amount: numericAmount, 
      category, 
      type: formType,
      ...(formType === 'expense' && dueDate && { dueDate })
    };

    onAddTransaction(transactionData);
    setDescription('');
    setAmount('');
    setDueDate('');
  };

  const categories = formType === 'income' 
    ? ['Salário', 'Investimentos', 'Vendas', 'Outros']
    : ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Contas', 'Outros'];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg w-full">
      <div className="flex items-center gap-2 mb-6 border-b dark:border-gray-700 pb-4">
        <input
            type="text"
            value={personData.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome do Painel"
            aria-label={`Nome do painel, atualmente ${personData.name}`}
            className="text-2xl font-bold text-brand-primary dark:text-blue-400 w-full bg-transparent focus:bg-gray-50 dark:focus:bg-gray-700 rounded-md p-1 -ml-1 transition-colors outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <PencilIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center gap-4">
          <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-full"><ArrowUpCircleIcon className="h-6 w-6 text-green-700 dark:text-green-300" /></div>
          <div>
            <p className="text-sm text-green-700 dark:text-green-300 font-semibold">Receitas</p>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">R$ {income.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center gap-4">
          <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-full"><ArrowDownCircleIcon className="h-6 w-6 text-red-700 dark:text-red-300" /></div>
          <div>
            <p className="text-sm text-red-700 dark:text-red-300 font-semibold">Despesas</p>
            <p className="text-xl font-bold text-red-800 dark:text-red-200">R$ {expense.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full"><ScaleIcon className="h-6 w-6 text-blue-700 dark:text-blue-300" /></div>
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">Saldo</p>
            <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-red-800 dark:text-red-200'}`}>R$ {balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b-2 dark:border-gray-700 mb-4">
            <button 
                onClick={() => setFormType('expense')}
                className={`flex-1 pb-2 text-center font-semibold transition-colors border-b-4 ${formType === 'expense' ? 'border-brand-primary text-brand-primary dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Nova Despesa
            </button>
            <button 
                onClick={() => setFormType('income')}
                className={`flex-1 pb-2 text-center font-semibold transition-colors border-b-4 ${formType === 'income' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Nova Receita
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            
            <div className="relative lg:col-span-2">
              <label htmlFor="description" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Descrição</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-5">
                <PencilIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="description"
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Ex: Almoço" 
                className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:bg-gray-600"
              />
            </div>

            <div className="relative">
              <label htmlFor="amount" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Valor (R$)</label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-5">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="amount"
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="15,00" 
                className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:bg-gray-600" 
              />
            </div>
            
            {formType === 'expense' && (
              <div className="relative">
                 <label htmlFor="dueDate" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Vencimento</label>
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-5">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="dueDate"
                  type="date" 
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:bg-gray-600"
                />
              </div>
            )}

            <div className={`relative ${formType === 'income' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
               <label htmlFor="category" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Categoria</label>
               <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-5">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select 
                id="category"
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                className="w-full appearance-none rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:bg-gray-600"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button 
              type="submit" 
              className="lg:col-span-6 w-full transform rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95 dark:hover:bg-blue-500 flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Adicionar Transação
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 pb-2 mb-4">Histórico de Transações</h3>
        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {personData.transactions.length > 0 ? (
            [...personData.transactions].reverse().map(t => <TransactionRow key={t.id} transaction={t} />)
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma transação registrada ainda.</p>
          )}
        </ul>
      </div>
    </div>
  );
};
