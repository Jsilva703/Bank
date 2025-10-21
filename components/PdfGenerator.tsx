import React, { useState } from "react";
import { PersonData, Transaction } from "../types";
import { DocumentArrowDownIcon } from "./icons/DocumentArrowDownIcon";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const PdfGenerator: React.FC<{ personData: PersonData }> = ({
  personData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generatePdf = () => {
    setIsLoading(true);
    // Use a timeout to allow the loading state to render before the blocking PDF generation
    setTimeout(() => {
      try {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Relatório Financeiro Pessoal", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        const addPersonSection = (person: PersonData, startY: number) => {
          doc.setFontSize(14);
          doc.text(`Relatório de ${person.name}`, 14, startY);

          const income = person.transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);
          const expense = person.transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

          doc.setFontSize(11);
          doc.text(
            `Total Receitas: R$ ${income.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            14,
            startY + 7
          );
          doc.text(
            `Total Despesas: R$ ${expense.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            14,
            startY + 14
          );
          doc.text(
            `Saldo: R$ ${(income - expense).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            14,
            startY + 21
          );

          const tableData = person.transactions.map((t: Transaction) => [
            t.description,
            t.category,
            t.dueDate ? new Date(t.dueDate).toLocaleDateString("pt-BR") : "-",
            t.type === "income"
              ? `+ R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `- R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          ]);

          // jspdf-autotable v5 exports a function — call it with the doc as first arg
          const tableResult = (autoTable as any)(doc, {
            startY: startY + 28,
            head: [["Descrição", "Categoria", "Vencimento", "Valor"]],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [74, 144, 226] },
          });

          // try to read finalY from the returned result or from doc.lastAutoTable (fallback)
          const finalY =
            (tableResult && tableResult.finalY) ||
            (doc as any).lastAutoTable?.finalY ||
            startY + 28;
          return finalY + 10;
        };

        addPersonSection(personData, 40);

        // Trigger a download directly
        const filename = `relatorio_${personData.name.replace(/\s/g, "_")}.pdf`;
        // Prefer save method which works reliably across environments
        (doc as any).save(filename);
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert(
          "Não foi possível gerar o PDF. Verifique o console para mais detalhes."
        );
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-primary dark:text-blue-400 mb-1">
        Seus Dados. Seus Relatórios.
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Gere um relatório em PDF do seu histórico financeiro para salvar ou
        compartilhar.
      </p>
      <div className="flex">
        <button
          onClick={generatePdf}
          disabled={isLoading}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-wait"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          {isLoading ? "Gerando Relatório..." : "Gerar Relatório em PDF"}
        </button>
      </div>

      {/* Preview removed — downloads start immediately when generated */}
    </div>
  );
};
