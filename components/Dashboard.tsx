import React, { useMemo } from "react";
import { PersonData } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ArrowUpCircleIcon } from "./icons/ArrowUpCircleIcon";
import { ArrowDownCircleIcon } from "./icons/ArrowDownCircleIcon";
import { ScaleIcon } from "./icons/ScaleIcon";
import { ChartPieIcon } from "./icons/ChartPieIcon";
import { CurrencyDollarIcon } from "./icons/CurrencyDollarIcon";
import { PiggyBankIcon } from "./icons/PiggyBankIcon";

interface DashboardProps {
  personData: PersonData;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatCompactCurrency = (value: number) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 10000) {
    return `R$ ${(value / 1000).toFixed(0)}K`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}K`;
  }
  return `R$ ${value.toFixed(0)}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </p>
        <p className="text-sm text-brand-secondary dark:text-teal-300">
          Saldo: {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ personData }) => {
  const { 
    balance, 
    income, 
    expense, 
    balanceHistory, 
    expenseByCategory, 
    biggestExpense, 
    avgMonthlyExpense,
    savingsRate,
    topCategory 
  } = useMemo(() => {
    const income = personData.transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const expense = personData.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const balance = income - expense;

    // Histórico de saldo dos últimos 6 meses (simulado com base nas transações)
    const balanceHistory = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = personData.transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);
      
      const monthExpense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      
      balanceHistory.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        saldo: monthIncome - monthExpense,
        receitas: monthIncome,
        despesas: monthExpense
      });
    }

    // Análise de categorias
    const expenseByCategory = personData.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    const sortedCategories = Object.entries(expenseByCategory)
      .sort(([, a], [, b]) => (b as number) - (a as number));
    
    const topCategory = sortedCategories[0] || ['', 0];
    const biggestExpense = Math.max(...personData.transactions
      .filter(t => t.type === 'expense')
      .map(t => t.amount), 0);

    // Média mensal de gastos
    const avgMonthlyExpense = expense / 6; // Considerando 6 meses
    
    // Taxa de poupança
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    return {
      balance,
      income,
      expense,
      balanceHistory,
      expenseByCategory,
      biggestExpense,
      avgMonthlyExpense,
      savingsRate,
      topCategory
    };
  }, [personData.transactions]);

  // Cards de métricas principais
  const MetricCard: React.FC<{
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'teal';
    trend?: 'up' | 'down' | 'stable';
  }> = ({ title, value, subtitle, icon, color, trend }) => {
    const colorClasses = {
      green: 'border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50/80 to-white dark:from-green-900/10 dark:to-slate-800',
      red: 'border-red-200 dark:border-red-700 bg-gradient-to-br from-red-50/80 to-white dark:from-red-900/10 dark:to-slate-800',
      blue: 'border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-900/10 dark:to-slate-800',
      purple: 'border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/80 to-white dark:from-purple-900/10 dark:to-slate-800',
      yellow: 'border-yellow-200 dark:border-yellow-700 bg-gradient-to-br from-yellow-50/80 to-white dark:from-yellow-900/10 dark:to-slate-800',
      teal: 'border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50/80 to-white dark:from-teal-900/10 dark:to-slate-800'
    };

    const iconColorClasses = {
      green: 'text-green-600 dark:text-green-400',
      red: 'text-red-600 dark:text-red-400',
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      teal: 'text-teal-600 dark:text-teal-400'
    };

    const textColorClasses = {
      green: 'text-green-800 dark:text-green-200',
      red: 'text-red-800 dark:text-red-200',
      blue: 'text-blue-800 dark:text-blue-200',
      purple: 'text-purple-800 dark:text-purple-200',
      yellow: 'text-yellow-800 dark:text-yellow-200',
      teal: 'text-teal-800 dark:text-teal-200'
    };

    return (
      <div className={`group relative border rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${colorClasses[color]}`}>
        {/* Header com ícone e título */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-white/70 dark:bg-slate-700/50 shadow-sm ${iconColorClasses[color]}`}>
              {icon}
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${textColorClasses[color]} opacity-80`}>
                {title}
              </h3>
            </div>
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-slate-700/50 ${textColorClasses[color]}`}>
              {trend === 'up' && <ArrowUpCircleIcon className="h-3 w-3" />}
              {trend === 'down' && <ArrowDownCircleIcon className="h-3 w-3" />}
              <span className="text-xs font-medium">
                {trend === 'up' && 'Crescimento'}
                {trend === 'down' && 'Redução'}
                {trend === 'stable' && 'Estável'}
              </span>
            </div>
          )}
        </div>
        
        {/* Valor principal */}
        <div className="mb-2">
          <p className={`text-3xl font-bold ${textColorClasses[color]}`}>
            {value}
          </p>
        </div>
        
        {/* Subtitle */}
        {subtitle && (
          <p className={`text-sm ${textColorClasses[color]} opacity-70`}>
            {subtitle}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Cards de Resumo */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Saldo Atual"
          value={formatCompactCurrency(balance)}
          subtitle={balance >= 0 ? "Situação positiva" : "Atenção necessária"}
          icon={<ScaleIcon className="h-6 w-6" />}
          color={balance >= 0 ? "green" : "red"}
          trend={balance >= 0 ? "up" : "down"}
        />
        
        <MetricCard
          title="Maior Categoria"
          value={topCategory[0] || "Sem dados"}
          subtitle={topCategory[1] > 0 ? formatCompactCurrency(topCategory[1]) : ""}
          icon={<ChartPieIcon className="h-6 w-6" />}
          color="purple"
        />

        <MetricCard
          title="Taxa de Poupança"
          value={`${savingsRate.toFixed(1)}%`}
          subtitle={savingsRate > 20 ? "Excelente!" : savingsRate > 10 ? "Bom" : "Pode melhorar"}
          icon={<PiggyBankIcon className="h-6 w-6" />}
          color={savingsRate > 20 ? "green" : savingsRate > 10 ? "yellow" : "red"}
          trend={savingsRate > 20 ? "up" : savingsRate > 10 ? "stable" : "down"}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Evolução do Saldo */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-teal-100 to-primary-200 dark:from-teal-900/30 dark:to-primary-800/30 rounded-xl shadow-sm">
              <ScaleIcon className="h-6 w-6 text-brand-secondary dark:text-teal-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Evolução do Saldo
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Acompanhe sua evolução financeira
              </p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceHistory} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  className="text-slate-600 dark:text-slate-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-slate-600 dark:text-slate-400"
                  tickFormatter={(value) => formatCompactCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categorias */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl shadow-sm">
              <ChartPieIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Gastos por Categoria
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Top 5 categorias com mais gastos
              </p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            {Object.keys(expenseByCategory).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={Object.entries(expenseByCategory)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([category, amount]) => ({ category, amount }))}
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 11 }}
                    className="text-slate-600 dark:text-slate-400"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-slate-600 dark:text-slate-400"
                    tickFormatter={(value) => formatCompactCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Valor']}
                    labelStyle={{ color: '#1e293b' }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                  <ChartPieIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Nenhuma despesa cadastrada
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Adicione algumas despesas para ver o gráfico
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores de Performance */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl shadow-sm">
            <ScaleIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              Indicadores de Performance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Métricas essenciais da sua situação financeira
            </p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center group">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
              balance >= 0 ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30'
            }`}>
              <ScaleIcon className={`h-8 w-8 ${
                balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Situação Financeira
            </p>
            <p className={`text-xl font-bold ${
              balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {balance >= 0 ? 'Positiva' : 'Negativa'}
            </p>
          </div>

          <div className="text-center group">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
              savingsRate > 20 ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' : 
              savingsRate > 10 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30' : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30'
            }`}>
              <PiggyBankIcon className={`h-8 w-8 ${
                savingsRate > 20 ? 'text-green-600 dark:text-green-400' : 
                savingsRate > 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Capacidade de Poupança
            </p>
            <p className={`text-xl font-bold ${
              savingsRate > 20 ? 'text-green-600 dark:text-green-400' : 
              savingsRate > 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {savingsRate > 20 ? 'Excelente' : savingsRate > 10 ? 'Boa' : 'Baixa'}
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br from-teal-100 to-primary-200 dark:from-teal-900/30 dark:to-primary-800/30 transition-all duration-200 group-hover:scale-110">
              <ChartPieIcon className="h-8 w-8 text-brand-secondary dark:text-teal-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Diversificação
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {Object.keys(expenseByCategory).length} categorias
            </p>
          </div>

          <div className="text-center group">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
              expense < income * 0.8 ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30' : 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30'
            }`}>
              <CurrencyDollarIcon className={`h-8 w-8 ${
                expense < income * 0.8 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
              }`} />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Controle de Gastos
            </p>
            <p className={`text-xl font-bold ${
              expense < income * 0.8 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {expense < income * 0.8 ? 'Controlado' : 'Atenção'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};