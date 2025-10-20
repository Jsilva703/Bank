import React, { useState, useMemo } from 'react';
import { PersonData } from '../types';
import { getFinancialAnalysis } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckIcon } from './icons/CheckIcon';

interface AiAssistantProps {
  personData: PersonData;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ personData }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await getFinancialAnalysis(personData);
      setAnalysis(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasExpenses = personData.transactions.some(t => t.type === 'expense');

  const formattedAnalysis = useMemo(() => {
    if (!analysis) return null;

    const withSeparators = analysis.replace(/---/g, '<hr class="my-4 border-gray-200 dark:border-gray-600">');

    const withListItems = withSeparators
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/# (.*?)\n/g, '<h4 class="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">$1</h4>')
      .replace(/\* (.*?)(?=\n\*|\n\n|$)/g, (match, content) => `
        <li class="flex items-start">
          <span class="flex-shrink-0 w-5 h-5 bg-brand-secondary/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <svg class="w-3 h-3 text-brand-secondary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          </span>
          <span>${content.trim()}</span>
        </li>
      `);
      
      return withListItems.replace(/(<li.*?>.*?<\/li>)+/gs, (match) => `<ul class="space-y-3">${match}</ul>`);

  }, [analysis]);


  return (
    <div>
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-brand-primary dark:text-blue-400">Assistente Financeiro</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Receba insights e sugestões personalizadas para otimizar suas finanças.</p>
      
      <button
        onClick={handleGenerateAnalysis}
        disabled={isLoading || !hasExpenses}
        className="w-full flex justify-center items-center bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-500 transition-all shadow-md active:scale-95 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? (
            <>
                <SpinnerIcon className="h-5 w-5 mr-2" />
                Analisando...
            </>
        ) : (
            'Gerar Sugestões'
        )}
      </button>
      {!hasExpenses && <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">Adicione pelo menos uma despesa para habilitar a análise.</p>}


      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-800/40 rounded-lg border border-red-300 dark:border-red-600 text-center">
          <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
        </div>
      )}

      {formattedAnalysis && (
         <div className="mt-6 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formattedAnalysis }}
            />
         </div>
      )}
    </div>
  );
};