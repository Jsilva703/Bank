import React, { useState } from 'react';
import { PersonData } from '../types';
import { AiAssistant } from './AiAssistant';
import { PdfGenerator } from './PdfGenerator';
import { SparklesIcon } from './icons/SparklesIcon';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';

interface ActionPanelProps {
    personData: PersonData;
}

type ActiveTab = 'assistant' | 'pdf';

export const ActionPanel: React.FC<ActionPanelProps> = ({ personData }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('assistant');

    const TabButton: React.FC<{
        label: string;
        tabName: ActiveTab;
        icon: React.ReactNode;
    }> = ({ label, tabName, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 font-semibold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                activeTab === tabName
                    ? 'bg-white dark:bg-gray-800 text-brand-primary dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-selected={activeTab === tabName}
            role="tab"
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full">
            <div className="flex" role="tablist">
                <TabButton
                    label="Assistente"
                    tabName="assistant"
                    icon={<SparklesIcon className="h-5 w-5" />}
                />
                <TabButton
                    label="Relatórios"
                    tabName="pdf"
                    icon={<DocumentArrowDownIcon className="h-5 w-5" />}
                />
            </div>
            <div className="p-4 sm:p-6" role="tabpanel">
                {activeTab === 'assistant' && <AiAssistant personData={personData} />}
                {activeTab === 'pdf' && <PdfGenerator personData={personData} />}
            </div>
        </div>
    );
};