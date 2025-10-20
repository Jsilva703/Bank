
import React, { useMemo } from 'react';
import { CoupleFinances } from '../types';

// TypeScript declarations for CDN libraries
declare const Recharts: any;

export const CombinedView: React.FC<{ finances: CoupleFinances }> = ({ finances }) => {
  // Guard clause to prevent error if Recharts hasn't loaded from the CDN yet.
  if (typeof Recharts === 'undefined' || !Recharts) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-brand-primary mb-1">Visão Combinada</h2>
            <p className="text-gray-600 mb-6">Transparência e Alinhamento para seus objetivos.</p>
            <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-gray-500 animate-pulse">Carregando gráfico...</p>
            </div>
        </div>
    );
  }
  
  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

  const { combinedIncome, combinedExpense, combinedBalance, expenseByCategory } = useMemo(() => {
    const allTransactions = [...finances.person1.transactions, ...finances.person2.transactions];
    const combinedIncome = allTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const combinedExpense = allTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const combinedBalance = combinedIncome - combinedExpense;

    const expenseByCategoryMap = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const expenseByCategory = Object.keys(expenseByCategoryMap)
      .map(key => ({ name: key, value: expenseByCategoryMap[key] }))
      .sort((a, b) => b.value - a.value);

    return { combinedIncome, combinedExpense, combinedBalance, expenseByCategory };
  }, [finances]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-brand-primary mb-1">Visão Combinada</h2>
      <p className="text-gray-600 mb-6">Transparência e Alinhamento para seus objetivos.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-sm text-green-800 font-semibold">Receita Total</p>
          <p className="text-2xl font-bold text-green-900">R$ {combinedIncome.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <p className="text-sm text-red-800 font-semibold">Despesa Total</p>
          <p className="text-2xl font-bold text-red-900">R$ {combinedExpense.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800 font-semibold">Saldo do Casal</p>
          <p className={`text-2xl font-bold ${combinedBalance >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
            R$ {combinedBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Despesas por Categoria</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={expenseByCategory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="value" name="Despesa" fill="#4A90E2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
