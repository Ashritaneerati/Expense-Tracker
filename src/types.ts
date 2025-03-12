export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export type FinancialHealth = 'healthy' | 'balanced' | 'struggling' | 'critical';

export interface FinancialState {
  expenses: Expense[];
  incomes: Income[];
  budgets: Budget[];
  totalExpenses: number;
  totalIncome: number;
  health: FinancialHealth;
}