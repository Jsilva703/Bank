import React, { useState } from 'react';
import { PersonData, Transaction } from '../types';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';

declare const jspdf: any;

export const PdfGenerator: React.FC<{ personData: PersonData }> = ({ personData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePdf = () => {
    setIsLoading(true);
    // Use a timeout to allow the loading state to render before the blocking PDF generation
    setTimeout(() => {
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text('Relatório Financeiro Pessoal', 14, 22);
            doc.setFontSize(11);
            doc.setTextColor(100);

            const addPersonSection = (person: PersonData, startY: number) => {
                doc.setFontSize(14);
                doc.text(`Relatório de ${person.name}`, 14, startY);
                
                const income = person.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                const expense = person.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

                doc.setFontSize(11);
                doc.text(`Total Receitas: R$ ${income.toFixed(2)}`, 14, startY + 7);
                doc.text(`Total Despesas: R$ ${expense.toFixed(2)}`, 14, startY + 14);
                doc.text(`Saldo: R$ ${(income - expense).toFixed(2)}`, 14, startY + 21);
                
                const tableData = person.transactions.map((t: Transaction) => [
                    t.description,
                    t.category,
                    t.dueDate ? new Date(t.dueDate).toLocaleDateString('pt-BR') : '-',
                    t.type === 'income' ? `+ R$ ${t.amount.toFixed(2)}` : `- R$ ${t.amount.toFixed(2)}`,
                ]);
                
                (doc as any).autoTable({
                    startY: startY + 28,
                    head: [['Descrição', 'Categoria', 'Vencimento', 'Valor']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [74, 144, 226] }
                });
                
                return (doc as any).lastAutoTable.finalY + 10;
            };

            addPersonSection(personData, 40);
            
            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            setPdfUrl(url);
            setIsModalOpen(true);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Não foi possível gerar o PDF. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, 50);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-primary dark:text-blue-400 mb-1">Seus Dados. Seus Relatórios.</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Gere um relatório em PDF do seu histórico financeiro para salvar ou compartilhar.</p>
      <div className="flex">
        <button 
          onClick={generatePdf} 
          disabled={isLoading}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-wait"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          {isLoading ? 'Gerando Relatório...' : 'Gerar Relatório em PDF'}
        </button>
      </div>

      {isModalOpen && pdfUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
          aria-modal="true"
          role="dialog"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md text-center transform transition-all scale-100"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Seu relatório está pronto!</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">Escolha como você gostaria de prosseguir.</p>
            
            <div className="space-y-4">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-500 transition-all shadow-md"
                onClick={closeModal}
              >
                Visualizar PDF
              </a>
              <a
                href={pdfUrl}
                download={`relatorio_${personData.name.replace(/\s/g, '_')}.pdf`}
                className="w-full block bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all shadow-md"
                onClick={closeModal}
              >
                Baixar PDF
              </a>
            </div>
            
            <button
              onClick={closeModal}
              className="mt-8 text-sm text-gray-500 dark:text-gray-400 hover:underline"
              aria-label="Fechar modal"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};