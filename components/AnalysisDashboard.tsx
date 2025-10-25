import React, { useMemo, useState } from "react";
import { PersonData } from "../types";
import { ChartPieIcon } from "./icons/ChartPieIcon";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#6366F1",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage =
      data.total > 0 ? ((data.value / data.total) * 100).toFixed(0) : "0";
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          {data.name}
        </p>
        <p className="text-sm text-brand-secondary dark:text-teal-300">
          R$ {data.value.toFixed(2)} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const AnalysisDashboard: React.FC<{ personData: PersonData }> = ({
  personData,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { expenseByCategory, totalExpense } = useMemo(() => {
    const expenses = personData.transactions.filter(
      (t) => t.type === "expense"
    );
    const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

    const expenseByCategoryMap = expenses.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as { [key: string]: number }
    );

    const expenseByCategory = Object.keys(expenseByCategoryMap)
      .map((key) => ({
        name: key,
        value: expenseByCategoryMap[key],
        total: totalExpense,
      }))
      .sort((a, b) => b.value - a.value);

    return { expenseByCategory, totalExpense };
  }, [personData.transactions]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const activeData =
    activeIndex !== null ? expenseByCategory[activeIndex] : null;

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-brand-secondary dark:text-teal-300 mb-1 flex items-center gap-2">
        <ChartPieIcon className="h-6 w-6" /> Análise de Despesas
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Veja a proporção dos seus gastos por categoria.
      </p>

      {expenseByCategory.length === 0 ? (
        <div
          style={{ width: "100%", height: 250 }}
          className="flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-lg"
        >
          <p className="text-slate-500 dark:text-slate-400 text-center">
            Adicione algumas despesas
            <br />
            para ver a análise por categoria.
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="relative w-full max-w-[250px] h-[250px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  activeIndex={activeIndex}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  labelLine={false}
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="focus:outline-none outline-none"
                      style={{ outline: "none", border: "none" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-3/4">
              {activeData ? (
                <>
                  <p
                    className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate"
                    title={activeData.name}
                  >
                    {activeData.name}
                  </p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    R$ {activeData.value.toFixed(2)}
                  </p>
                  <p className="text-xs font-semibold text-brand-secondary dark:text-teal-300">
                    {totalExpense > 0
                      ? ((activeData.value / totalExpense) * 100).toFixed(0)
                      : 0}
                    % do total
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total Gasto
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    R$ {totalExpense.toFixed(2)}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto self-center">
            <ul className="space-y-1">
              {expenseByCategory.map((entry, index) => {
                const percentage =
                  totalExpense > 0
                    ? ((entry.value / totalExpense) * 100).toFixed(0)
                    : "0";
                const isActive = activeIndex === index;
                return (
                  <li
                    key={`legend-${index}`}
                    className={`p-2 rounded-md transition-all duration-200 cursor-pointer ${isActive ? "bg-slate-100 dark:bg-slate-700" : "bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50"}`}
                    onMouseEnter={() => onPieEnter(null, index)}
                    onMouseLeave={onPieLeave}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 truncate">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span
                          className="text-sm text-slate-600 dark:text-slate-300 truncate"
                          title={entry.name}
                        >
                          {entry.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {percentage}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
