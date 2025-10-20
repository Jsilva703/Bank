import React from 'react';
import { PersonData, Transaction } from '../types';
import { DocumentArrowDownIcon } from './icons/DocumentArrowDownIcon';

declare const jspdf: any;

export const PdfGenerator: React.FC<{ personData: PersonData }> = ({ personData }) => {
  
  const generatePdf = () => {
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
    doc.save(`relatorio_${personData.name}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-brand-primary dark:text-blue-400 mb-1">Seus Dados. Seus Relatórios.</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Gere um relatório em PDF do seu histórico financeiro.</p>
      <div className="flex">
        <button onClick={generatePdf} className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
          <DocumentArrowDownIcon className="h-5 w-5" />
          Gerar Relatório em PDF
        </button>
      </div>
    </div>
  );
};
