export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  dueDate?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface PersonData {
  name: string;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
}

export interface CoupleFinances {
  person1: PersonData;
  person2: PersonData;
}
