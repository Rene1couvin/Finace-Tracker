export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Salary' 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Utilities' 
  | 'Housing' 
  | 'Freelance'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  title: string;
  date: string;
  userId: string;
  createdAt: Date;
}

export interface TransactionStats {
  income: number;
  expense: number;
  balance: number;
}
