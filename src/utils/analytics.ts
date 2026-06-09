import { TransactionData } from '../types/transaction';

const EXCLUDED_AVERAGE_DAILY_EXPENSE_CATEGORIES = new Set(['Investments']);
const AVERAGE_DAILY_EXPENSE_DAYS = 30;

export function calculateAverageDailyExpense(transactions: TransactionData[]): number {
  const totalEligibleExpenses = transactions
    .filter(
      (transaction) =>
        transaction['Expense/Income'] === 'Expense' &&
        !EXCLUDED_AVERAGE_DAILY_EXPENSE_CATEGORIES.has(transaction.Category)
    )
    .reduce((sum, transaction) => sum + transaction.Effective, 0);

  return totalEligibleExpenses / AVERAGE_DAILY_EXPENSE_DAYS;
}
