// Shared transaction data interface
export interface TransactionData {
  Amount: number;
  "Expense/Income": string;
  Date: string;
  ModeOfPayment: string;
  Category: string;
  Message: string;
  SalaryBifercationCat: string;
  Minus: string | number;
  Effective: number;
}

// Shared constants
export const BASE_MONTHLY_INCOME = 81000;
