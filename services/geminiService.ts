import { PersonData } from '../types';

export const getFinancialAnalysis = (personData: PersonData): Promise<string> => {
  // Simulate an async operation for a better user experience in the component
  return new Promise((resolve) => {
    setTimeout(() => {
      const analysisParts: string[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expenses = personData.transactions.filter(t => t.type === 'expense');

      // Rule 1: Overdue Bills
      const overdueBills = expenses
        .filter(t => t.dueDate && new Date(t.dueDate) < today)
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
        
      if (overdueBills.length > 0) {
        let section = "# ⚠️ Contas Atrasadas\n\n";
        section += "**Atenção:** Você possui contas que já venceram. Pagar contas em atraso pode gerar multas e juros. Priorize o pagamento delas o mais rápido possível.\n\n";
        section += "**Contas vencidas:**\n";
        overdueBills.forEach(t => {
          section += `* ${t.description} (Venceu em ${new Date(t.dueDate!).toLocaleDateString('pt-BR')}) - ${t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
        });
        analysisParts.push(section);
      }

      // Rule 2: Upcoming Bills
      const upcomingBills = expenses
        .filter(t => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays >= 0 && diffDays <= 7;
        })
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

      if (upcomingBills.length > 0) {
        let section = "# 🗓️ Contas Próximas do Vencimento\n\n";
        section += "**Fique de olho!** As seguintes contas vencem em breve. Organize-se para não perder o prazo.\n\n";
        section += "**Contas a vencer:**\n";
        upcomingBills.forEach(t => {
          section += `* ${t.description} (Vence em ${new Date(t.dueDate!).toLocaleDateString('pt-BR')}) - ${t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
        });
        analysisParts.push(section);
      }
      
      // Rule 3: Highest Spending Category
      if (expenses.length > 0) {
        const expenseByCategory = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as { [key: string]: number });

        const highestCategory = Object.entries(expenseByCategory).sort(([, a], [, b]) => b - a)[0];
        
        if (highestCategory) {
            let section = "# 📊 Análise de Gastos\n\n";
            section += `**Onde seu dinheiro está indo?** Sua maior despesa é com **${highestCategory[0]}**, totalizando **${highestCategory[1].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}**.\n\n`;
            section += "* Avalie se é possível reduzir despesas nessa área. Pequenos cortes podem fazer uma grande diferença no final do mês.";
            analysisParts.push(section);
        }
      }

      // Rule 4: Income vs. Expense
      const income = personData.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenseTotal = expenses.reduce((sum, t) => sum + t.amount, 0);
      const balance = income - expenseTotal;

      if (income > 0 || expenseTotal > 0) {
          if (expenseTotal > income) {
              let section = "# ⚖️ Balanço Mensal\n\n";
              section += `**Atenção, saldo negativo!** Suas despesas (${expenseTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) foram maiores que suas receitas (${income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). É importante reavaliar seus gastos.\n\n`;
              section += "* Reveja seu orçamento e identifique onde pode economizar para reverter essa situação.";
              analysisParts.push(section);
          } else if (income > 0 && expenseTotal > income * 0.8) {
              let section = "# ⚖️ Balanço Mensal\n\n";
              section += `**Cuidado com o orçamento!** Suas despesas (${expenseTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) representam mais de 80% da sua receita (${income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}). Isso pode deixar pouco espaço para imprevistos e para poupar.\n\n`;
              section += "* Tente identificar gastos não essenciais que podem ser cortados ou reduzidos.";
              analysisParts.push(section);
          } else if (income > 0 && balance >= 0) {
              let section = "# 💰 Saldo Positivo!\n\n";
              section += `**Bom trabalho!** Você manteve um saldo positivo de **${balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}**.\n\n`;
              section += "* Considere usar parte desse valor para começar uma reserva de emergência ou para investir em seus objetivos de longo prazo.";
              analysisParts.push(section);
          }
      }

      // Rule 5: General Tips
      if (analysisParts.length < 2 && personData.transactions.length > 0) {
         let section = "# ✨ Dicas Gerais\n\n";
         section += "* **Planejamento é tudo:** Crie um orçamento mensal. Defina limites de gastos para cada categoria e acompanhe seu progresso.\n";
         section += "* **Reserva de Emergência:** Ter um fundo para cobrir de 3 a 6 meses de despesas essenciais pode trazer muita tranquilidade. Comece a construir o seu, mesmo que com pouco.\n";
         analysisParts.push(section);
      }

      if (analysisParts.length === 0) {
        resolve("# Nenhum insight por enquanto\n\nAdicione algumas transações, especialmente despesas com datas de vencimento, para receber sugestões personalizadas.");
      } else {
        resolve(analysisParts.join('\n\n---\n\n'));
      }
    }, 500);
  });
};