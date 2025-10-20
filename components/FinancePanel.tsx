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
import { CheckIcon } from './icons/CheckIcon';
import { CategoryIcon } from './icons/CategoryIcon';
import { TrashIcon } from './icons/TrashIcon';

interface FinancePanelProps {
  personData: PersonData;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onNameChange: (newName: string) => void;
}

const categories = {
    income: ['Salário', 'Investimentos', 'Vendas', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Contas', 'Outros']
};

const TransactionRow: React.FC<{ 
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
}> = ({ transaction, onEdit, onDelete }) => {
  const isOverdue = useMemo(() => {
    if (transaction.type !== 'expense' || !transaction.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return new Date(transaction.dueDate) < today;
  }, [transaction.dueDate, transaction.type]);
  
  const isIncome = transaction.type === 'income';
  
  return (
     <li className={`group flex justify-between items-center p-3 rounded-lg border-l-4 transition-all hover:shadow-md ${
        isIncome 
        ? 'bg-green-50 dark:bg-green-900/30 border-green-500' 
        : 'bg-red-50 dark:bg-red-900/30 border-red-500'
      }`}>
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <div className="flex-shrink-0"><CategoryIcon category={transaction.category} /></div>
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
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-bold text-lg whitespace-nowrap ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isIncome ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(transaction)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"><PencilIcon className="h-4 w-4" /></button>
            <button onClick={() => onDelete(transaction)} className="p-1.5 rounded-full hover:bg-red-200 dark:hover:bg-red-800/50 text-red-500 dark:text-red-400"><TrashIcon className="h-4 w-4" /></button>
        </div>
      </div>
    </li>
  );
};

const EditTransactionRow: React.FC<{
    transaction: Transaction;
    onSave: (transaction: Transaction) => void;
    onCancel: () => void;
}> = ({ transaction, onSave, onCancel }) => {
    const [edited, setEdited] = useState(transaction);

    const handleSave = () => {
        // Basic validation
        if (!edited.description.trim() || edited.amount <= 0) {
            alert("Descrição e valor positivo são obrigatórios.");
            return;
        }
        onSave(edited);
    };

    return (
        <li className="p-3 rounded-lg bg-blue-50 dark:bg-gray-700 border-l-4 border-brand-primary animate-pulse-fast">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input type="text" value={edited.description} onChange={e => setEdited({...edited, description: e.target.value})} placeholder="Descrição" className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary"/>
                <input type="number" value={edited.amount} onChange={e => setEdited({...edited, amount: parseFloat(e.target.value) || 0})} placeholder="Valor" className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary"/>
                <select value={edited.category} onChange={e => setEdited({...edited, category: e.target.value})} className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary">
                    {categories[edited.type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {edited.type === 'expense' && <input type="date" value={edited.dueDate?.split('T')[0] || ''} onChange={e => setEdited({...edited, dueDate: e.target.value})} className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary"/>}
            </div>
            <div className="flex justify-end gap-2 mt-3">
                <button onClick={onCancel} className="px-3 py-1 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-brand-primary rounded-md hover:bg-blue-600">Salvar</button>
            </div>
        </li>
    );
};


export const FinancePanel: React.FC<FinancePanelProps> = ({ personData, onAddTransaction, onUpdateTransaction, onDeleteTransaction, onNameChange }) => {
  const [description, setDescription] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [category, setCategory] = useState('Alimentação');
  const [dueDate, setDueDate] = useState('');
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [errors, setErrors] = useState<{ description?: string; amount?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const { income, expense, balance } = useMemo(() => {
    const income = personData.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = personData.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [personData.transactions]);
  
  const filteredAndSortedTransactions = useMemo(() => {
    let transactions = personData.transactions.filter(t => {
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    switch (sortOrder) {
        case 'amount-desc':
            return transactions.sort((a, b) => b.amount - a.amount);
        case 'amount-asc':
            return transactions.sort((a, b) => a.amount - b.amount);
        case 'date-desc':
        default:
            // Since we add transactions to the end, reversing gives date-desc
            return [...transactions].reverse();
    }
  }, [personData.transactions, searchTerm, filterType, sortOrder]);


  const parseAmount = (input: string): number => {
    if (!input) return 0;
    const sanitized = input.replace(/\./g, '').replace(',', '.');
    return parseFloat(sanitized);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
    }
    if (!rawValue) {
        setAmountInput('');
        return;
    }
    const numberValue = Number(rawValue) / 100;
    const formattedValue = numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    setAmountInput(formattedValue);
  };
  
  const validate = (): boolean => {
    const newErrors: { description?: string; amount?: string } = {};
    if (!description.trim()) newErrors.description = 'A descrição é obrigatória.';
    const numericAmount = parseAmount(amountInput);
    if (isNaN(numericAmount) || numericAmount <= 0) newErrors.amount = 'O valor deve ser um número positivo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleBlur = (field: 'description' | 'amount') => {
    const newErrors: { description?: string; amount?: string } = {...errors};
    if (field === 'description') if (!description.trim()) newErrors.description = 'A descrição é obrigatória.'; else delete newErrors.description;
    if (field === 'amount') {
        const numericAmount = parseAmount(amountInput);
        if (isNaN(numericAmount) || numericAmount <= 0) newErrors.amount = 'O valor deve ser um número positivo.'; else delete newErrors.amount;
    }
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const numericAmount = parseAmount(amountInput);
    const transactionData: Omit<Transaction, 'id' | 'date'> = { 
      description, 
      amount: numericAmount, 
      category, 
      type: formType,
      ...(formType === 'expense' && dueDate && { dueDate })
    };

    onAddTransaction(transactionData);
    
    setDescription('');
    setAmountInput('');
    setDueDate('');
    setErrors({});
    setSuccessMessage('Transação adicionada com sucesso!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFormTypeChange = (type: 'income' | 'expense') => {
    setFormType(type);
    setErrors({});
    setCategory(type === 'income' ? categories.income[0] : categories.expense[0]);
  };
  
  const handleSaveEdit = (transaction: Transaction) => {
    onUpdateTransaction(transaction);
    setEditingTransactionId(null);
  };
  
  const confirmDelete = () => {
    if (deletingTransaction) {
        onDeleteTransaction(deletingTransaction.id);
        setDeletingTransaction(null);
    }
  };

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
                onClick={() => handleFormTypeChange('expense')}
                className={`flex-1 pb-2 text-center font-semibold transition-colors border-b-4 ${formType === 'expense' ? 'border-brand-primary text-brand-primary dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Nova Despesa
            </button>
            <button 
                onClick={() => handleFormTypeChange('income')}
                className={`flex-1 pb-2 text-center font-semibold transition-colors border-b-4 ${formType === 'income' ? 'border-brand-secondary text-brand-secondary' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Nova Receita
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 items-start">
            <div className="md:col-span-2">
              <label htmlFor="description" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Descrição</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><PencilIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="description" type="text" value={description} onChange={e => { setDescription(e.target.value); if (errors.description) { setErrors(prev => ({ ...prev, description: undefined })); } }} onBlur={() => handleBlur('description')} placeholder="Ex: Almoço" className={`w-full rounded-lg bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-200 dark:focus:bg-gray-600 ${errors.description ? 'border-red-500 ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-primary'}`} aria-invalid={!!errors.description} aria-describedby="description-error"/>
              </div>
              {errors.description && <p id="description-error" className="text-xs text-red-600 dark:text-red-400 mt-1.5 ml-1">{errors.description}</p>}
            </div>
            <div>
              <label htmlFor="amount" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Valor (R$)</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CurrencyDollarIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="amount" type="text" value={amountInput} onChange={handleAmountChange} onBlur={() => handleBlur('amount')} placeholder="15,00" inputMode="decimal" className={`w-full rounded-lg bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-gray-200 dark:focus:bg-gray-600 ${errors.amount ? 'border-red-500 ring-red-500' : 'border-gray-200 dark:border-gray-600 focus:ring-brand-primary'}`} aria-invalid={!!errors.amount} aria-describedby="amount-error"/>
              </div>
               {errors.amount && <p id="amount-error" className="text-xs text-red-600 dark:text-red-400 mt-1.5 ml-1">{errors.amount}</p>}
            </div>
            <div>
               <label htmlFor="category" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Categoria</label>
               <div className="relative mt-1">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><TagIcon className="h-5 w-5 text-gray-400" /></div>
                  <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full appearance-none rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:bg-gray-600">
                    {categories[formType].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>
            {formType === 'expense' && (
              <div className="md:col-span-2">
                 <label htmlFor="dueDate" className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Vencimento</label>
                 <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CalendarIcon className="h-5 w-5 text-gray-400" /></div>
                    <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-lg border-gray-200 bg-gray-50 p-3 pl-10 text-sm text-gray-700 transition focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:bg-gray-600"/>
                 </div>
              </div>
            )}
            <div className="md:col-span-2 mt-2">
              {successMessage && (<div className="flex items-center gap-2 p-3 mb-4 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700"><CheckIcon className="h-5 w-5" /><p className="font-semibold text-sm">{successMessage}</p></div>)}
              <button type="submit" className="w-full transform rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95 dark:hover:bg-blue-500 flex items-center justify-center gap-2"><PlusIcon className="h-5 w-5" />Adicionar Transação</button>
            </div>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-600 pb-2 mb-4">Histórico de Transações</h3>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
            <input type="text" placeholder="Pesquisar por descrição..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-auto flex-grow rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary" />
            <div className="flex items-center gap-2">
                <div className="flex rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                    <button onClick={() => setFilterType('all')} className={`px-3 py-1 text-sm rounded-l-md ${filterType === 'all' ? 'bg-brand-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Todos</button>
                    <button onClick={() => setFilterType('income')} className={`px-3 py-1 text-sm ${filterType === 'income' ? 'bg-green-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Receitas</button>
                    <button onClick={() => setFilterType('expense')} className={`px-3 py-1 text-sm rounded-r-md ${filterType === 'expense' ? 'bg-red-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Despesas</button>
                </div>
                 <select value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm p-2 focus:ring-brand-primary focus:border-brand-primary">
                    <option value="date-desc">Mais Recentes</option>
                    <option value="amount-desc">Maior Valor</option>
                    <option value="amount-asc">Menor Valor</option>
                </select>
            </div>
        </div>

        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {filteredAndSortedTransactions.length > 0 ? (
            filteredAndSortedTransactions.map(t => 
                editingTransactionId === t.id ? (
                    <EditTransactionRow 
                        key={t.id} 
                        transaction={t} 
                        onSave={handleSaveEdit} 
                        onCancel={() => setEditingTransactionId(null)}
                    />
                ) : (
                    <TransactionRow 
                        key={t.id} 
                        transaction={t} 
                        onEdit={() => setEditingTransactionId(t.id)} 
                        onDelete={() => setDeletingTransaction(t)}
                    />
                )
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma transação encontrada.</p>
          )}
        </ul>
      </div>

       {deletingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={() => setDeletingTransaction(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Confirmar Exclusão</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">Tem certeza que deseja excluir a transação "{deletingTransaction.description}"?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeletingTransaction(null)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
              <button onClick={confirmDelete} className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};