import type { TransactionData } from '../types/transaction';

const CYCLE_START_DAY = 15;

export interface CycleBounds {
  id: string;
  start: string;
  end: string;
}

export interface CategoryDelta {
  category: string;
  currentAmount: number;
  previousAmount: number;
  delta: number;
}

export interface LargeTransactionInsight {
  message: string;
  amount: number;
  category: string;
  varianceContribution: number;
}

export interface CycleChangeAnalysis {
  currentCycle: CycleBounds;
  previousCycle: CycleBounds;
  currentTransactions: TransactionData[];
  previousTransactions: TransactionData[];
  currentTotal: number;
  previousTotal: number;
  topIncreases: CategoryDelta[];
  topDecreases: CategoryDelta[];
  newCategories: string[];
  missingCategories: string[];
  largeTransactions: LargeTransactionInsight[];
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTransactionDate(dateString: string): Date {
  const parsedDate = new Date(dateString);
  return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

export function getCycleBounds(referenceDate: Date): CycleBounds {
  const localDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const cycleStart =
    localDate.getDate() >= CYCLE_START_DAY
      ? new Date(localDate.getFullYear(), localDate.getMonth(), CYCLE_START_DAY)
      : new Date(localDate.getFullYear(), localDate.getMonth() - 1, CYCLE_START_DAY);
  const cycleEnd = addDays(addMonths(cycleStart, 1), -1);

  return {
    id: `${formatDateKey(cycleStart)}_to_${formatDateKey(cycleEnd)}`,
    start: formatDateKey(cycleStart),
    end: formatDateKey(cycleEnd),
  };
}

function getPreviousCycleBounds(currentCycle: CycleBounds): CycleBounds {
  const currentStart = new Date(currentCycle.start);
  return getCycleBounds(addDays(currentStart, -1));
}

function isExpense(transaction: TransactionData): boolean {
  return transaction['Expense/Income'] === 'Expense';
}

function isWithinCycle(transaction: TransactionData, cycle: CycleBounds): boolean {
  const transactionDate = formatDateKey(parseTransactionDate(transaction.Date));
  return transactionDate >= cycle.start && transactionDate <= cycle.end;
}

export function getTransactionsForCycle(
  transactions: TransactionData[],
  cycle: CycleBounds
): TransactionData[] {
  return transactions.filter((transaction) => isWithinCycle(transaction, cycle));
}

function groupByCategory(transactions: TransactionData[]): Record<string, number> {
  return transactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.Category] = (acc[transaction.Category] || 0) + transaction.Effective;
    return acc;
  }, {});
}

function toCategoryDeltas(current: Record<string, number>, previous: Record<string, number>): CategoryDelta[] {
  const categories = new Set([...Object.keys(current), ...Object.keys(previous)]);

  return Array.from(categories).map((category) => ({
    category,
    currentAmount: current[category] || 0,
    previousAmount: previous[category] || 0,
    delta: (current[category] || 0) - (previous[category] || 0),
  }));
}

export function analyzeCycleChanges(
  transactions: TransactionData[],
  referenceDate = new Date()
): CycleChangeAnalysis {
  const currentCycle = getCycleBounds(referenceDate);
  const previousCycle = getPreviousCycleBounds(currentCycle);

  const expenses = transactions.filter(isExpense);
  const currentTransactions = getTransactionsForCycle(expenses, currentCycle);
  const previousTransactions = getTransactionsForCycle(expenses, previousCycle);

  const currentTotal = currentTransactions.reduce((sum, transaction) => sum + transaction.Effective, 0);
  const previousTotal = previousTransactions.reduce((sum, transaction) => sum + transaction.Effective, 0);
  const varianceBase = Math.abs(currentTotal - previousTotal) || 1;

  const currentByCategory = groupByCategory(currentTransactions);
  const previousByCategory = groupByCategory(previousTransactions);
  const categoryDeltas = toCategoryDeltas(currentByCategory, previousByCategory);

  const topIncreases = categoryDeltas
    .filter((delta) => delta.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);

  const topDecreases = categoryDeltas
    .filter((delta) => delta.delta < 0)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3);

  const newCategories = categoryDeltas
    .filter((delta) => delta.previousAmount === 0 && delta.currentAmount > 0)
    .map((delta) => delta.category);

  const missingCategories = categoryDeltas
    .filter((delta) => delta.currentAmount === 0 && delta.previousAmount > 0)
    .map((delta) => delta.category);

  const largeTransactions = currentTransactions
    .filter((transaction) => transaction.Effective >= 2000)
    .sort((a, b) => b.Effective - a.Effective)
    .slice(0, 3)
    .map((transaction) => ({
      message: transaction.Message || `${transaction.Category} transaction`,
      amount: transaction.Effective,
      category: transaction.Category,
      varianceContribution: (transaction.Effective / varianceBase) * 100,
    }));

  return {
    currentCycle,
    previousCycle,
    currentTransactions,
    previousTransactions,
    currentTotal,
    previousTotal,
    topIncreases,
    topDecreases,
    newCategories,
    missingCategories,
    largeTransactions,
  };
}
