export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  dueDate?: string; // Adicionado para a data de vencimento
}

export interface PersonData {
  name: string;
  transactions: Transaction[];
}

// FIX: Added missing CoupleFinances interface to resolve import error in CombinedView.tsx.
export interface CoupleFinances {
  person1: PersonData;
  person2: PersonData;
}
