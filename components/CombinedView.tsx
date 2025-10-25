import React, { useState } from "react";
import { PersonData } from "../types";
import { Dashboard } from "./Dashboard";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { ChartPieIcon } from "./icons/ChartPieIcon";
import { ScaleIcon } from "./icons/ScaleIcon";
import { HomeIcon } from "./icons/HomeIcon";

interface CombinedViewProps {
  personData: PersonData;
}

type ViewMode = 'dashboard' | 'analysis';

export const CombinedView: React.FC<CombinedViewProps> = ({ personData }) => {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const MenuItem: React.FC<{
    label: string;
    viewName: ViewMode;
    icon: React.ReactNode;
    description: string;
  }> = ({ label, viewName, icon, description }) => (
    <button
      onClick={() => {
        setActiveView(viewName);
        setSidebarOpen(false); // Close sidebar on mobile after selection
      }}
      className={`group w-full text-left p-4 rounded-xl transition-all duration-200 focus:outline-none ${
        activeView === viewName
          ? 'bg-gradient-to-r from-primary-500 to-brand-secondary text-white shadow-lg'
          : 'text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-slate-700/50'
      }`}
      aria-selected={activeView === viewName}
      role="menuitem"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg transition-all duration-200 ${
          activeView === viewName 
            ? 'bg-white/20 text-white' 
            : 'bg-primary-200 dark:bg-slate-700 text-primary-600 dark:text-slate-400 group-hover:bg-primary-300 dark:group-hover:bg-slate-600'
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-base ${
            activeView === viewName ? 'text-white' : 'text-primary-800 dark:text-primary-200'
          }`}>
            {label}
          </h3>
          <p className={`text-sm mt-1 ${
            activeView === viewName ? 'text-primary-100' : 'text-primary-600 dark:text-primary-400'
          }`}>
            {description}
          </p>
        </div>
        {activeView === viewName && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </div>
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-full">
      {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-brand-secondary rounded-lg shadow-lg">
            <HomeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-800 dark:text-primary-200">
              Minhas Contas
            </h2>
            <p className="text-xs text-primary-600 dark:text-primary-400">
              {activeView === 'dashboard' ? 'Dashboard' : 'Análise Detalhada'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-primary-200 dark:bg-slate-700 text-primary-600 dark:text-slate-400 hover:bg-primary-300 dark:hover:bg-slate-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden lg:flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/20">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex-1 flex items-center justify-center gap-3 p-6 font-semibold transition-all duration-200 focus:outline-none relative ${
            activeView === 'dashboard'
              ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <div className={`p-3 rounded-xl transition-all duration-200 ${
            activeView === 'dashboard' 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}>
            <ScaleIcon className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold">Dashboard</h3>
            <p className="text-sm opacity-70">Visão geral das suas finanças</p>
          </div>
          {activeView === 'dashboard' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-20 bg-primary-600 rounded-full" />
          )}
        </button>
        
        <button
          onClick={() => setActiveView('analysis')}
          className={`flex-1 flex items-center justify-center gap-3 p-6 font-semibold transition-all duration-200 focus:outline-none relative ${
            activeView === 'analysis'
              ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <div className={`p-3 rounded-xl transition-all duration-200 ${
            activeView === 'analysis' 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}>
            <ChartPieIcon className="h-6 w-6" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold">Análise Detalhada</h3>
            <p className="text-sm opacity-70">Relatórios e análises completas</p>
          </div>
          {activeView === 'analysis' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-20 bg-primary-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden fixed z-50 w-80 h-full bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col transition-transform duration-300 ease-in-out`}>
        {/* Mobile Navigation Menu */}
        <nav className="space-y-3 flex-1 mt-4" role="menu">
          <MenuItem
            label="Dashboard"
            viewName="dashboard"
            icon={<ScaleIcon className="h-5 w-5" />}
            description="Visão geral das suas finanças"
          />
          <MenuItem
            label="Análise Detalhada"
            viewName="analysis"
            icon={<ChartPieIcon className="h-5 w-5" />}
            description="Relatórios e análises completas"
          />
        </nav>

        {/* Mobile Footer Info */}
        <div className="mt-auto pt-6">
          <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700/50 dark:to-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Status do Sistema
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <div className="p-6 lg:p-8">
          {activeView === 'dashboard' && <Dashboard personData={personData} />}
          {activeView === 'analysis' && <AnalysisDashboard personData={personData} />}
        </div>
      </div>
    </div>
  );
};
