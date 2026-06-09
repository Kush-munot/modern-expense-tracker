import type { TransactionData } from '../types/transaction.ts';
import { BASE_MONTHLY_INCOME } from '../types/transaction.ts';

export interface DisclosureSummaryItem {
  label: string;
  value: string;
}

function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString()}`;
}

export function summarizeQuickStats(transactions: TransactionData[]): DisclosureSummaryItem[] {
  const expenses = transactions
    .filter((transaction) => transaction['Expense/Income'] === 'Expense')
    .slice()
    .sort((a, b) => b.Effective - a.Effective);

  const largestExpense = expenses[0];
  const topCategories = expenses.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.Category] = (acc[transaction.Category] || 0) + 1;
    return acc;
  }, {});

  const mostActiveCategory = Object.entries(topCategories).sort(([, a], [, b]) => b - a)[0];

  return [
    {
      label: 'Largest',
      value: largestExpense ? formatCurrency(largestExpense.Effective) : 'No expenses',
    },
    {
      label: 'Active',
      value: mostActiveCategory ? `${mostActiveCategory[0]} (${mostActiveCategory[1]})` : 'No categories',
    },
  ];
}

export function summarizeSpendingPatterns(transactions: TransactionData[]): DisclosureSummaryItem[] {
  const expenses = transactions.filter((transaction) => transaction['Expense/Income'] === 'Expense');
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.Effective, 0);
  const categoryTotals = expenses.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.Category] = (acc[transaction.Category] || 0) + transaction.Effective;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
  const wantsTotal = expenses
    .filter((transaction) => transaction.SalaryBifercationCat === 'Wants')
    .reduce((sum, transaction) => sum + transaction.Effective, 0);

  return [
    {
      label: 'Top category',
      value:
        topCategory && totalExpenses > 0
          ? `${topCategory[0]} (${((topCategory[1] / totalExpenses) * 100).toFixed(0)}%)`
          : 'No data',
    },
    {
      label: 'Wants share',
      value: totalExpenses > 0 ? `${((wantsTotal / totalExpenses) * 100).toFixed(0)}%` : '0%',
    },
  ];
}

export function summarizeBudgetRecommendations(transactions: TransactionData[]): DisclosureSummaryItem[] {
  const expenses = transactions.filter((transaction) => transaction['Expense/Income'] === 'Expense');
  const additionalIncome = transactions
    .filter((transaction) => transaction['Expense/Income'] === 'Income')
    .reduce((sum, transaction) => sum + transaction.Amount, 0);
  const totalIncome = BASE_MONTHLY_INCOME + additionalIncome;
  const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.Effective, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  const needsPercentage =
    totalIncome > 0
      ? (expenses
          .filter((transaction) => transaction.SalaryBifercationCat === 'Needs')
          .reduce((sum, transaction) => sum + transaction.Effective, 0) /
          totalIncome) *
        100
      : 0;
  const wantsPercentage =
    totalIncome > 0
      ? (expenses
          .filter((transaction) => transaction.SalaryBifercationCat === 'Wants')
          .reduce((sum, transaction) => sum + transaction.Effective, 0) /
          totalIncome) *
        100
      : 0;

  let alertCount = 0;
  if (savingsRate < 20) {
    alertCount += 1;
  }
  if (needsPercentage > 50) {
    alertCount += 1;
  }
  if (wantsPercentage > 30) {
    alertCount += 1;
  }

  return [
    {
      label: 'Savings',
      value: `${savingsRate.toFixed(1)}%`,
    },
    {
      label: 'Alerts',
      value: `${alertCount}`,
    },
  ];
}
