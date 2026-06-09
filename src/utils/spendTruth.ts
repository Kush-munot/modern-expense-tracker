import type { TransactionData } from '../types/transaction';

export type SpendTruthLane =
  | 'fixed'
  | 'flexible-essential'
  | 'discretionary'
  | 'investments';

export interface SpendTruthCategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface SpendTruthLaneSummary {
  lane: SpendTruthLane;
  amount: number;
  percentage: number;
  categories: SpendTruthCategorySummary[];
}

export interface SpendTruthSummary {
  visibleTotal: number;
  lanes: Record<SpendTruthLane, SpendTruthLaneSummary>;
}

export interface SpendTruthOptions {
  includeInvestments: boolean;
  categoryOverrides: Partial<Record<string, SpendTruthLane>>;
}

const FIXED_KEYWORDS = ['rent', 'subscription', 'internet', 'wifi', 'bill', 'recharge', 'airtel'];

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function summarizeLaneCategories(
  grouped: Record<string, number>,
  visibleTotal: number
): SpendTruthCategorySummary[] {
  return Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: visibleTotal > 0 ? (amount / visibleTotal) * 100 : 0,
    }));
}

export function classifySpendTruthLane(
  transaction: TransactionData,
  categoryOverrides: Partial<Record<string, SpendTruthLane>> = {}
): SpendTruthLane {
  if (categoryOverrides[transaction.Category]) {
    return categoryOverrides[transaction.Category] as SpendTruthLane;
  }

  const message = normalizeText(transaction.Message || '');
  const category = transaction.Category;
  const salaryCategory = transaction.SalaryBifercationCat;

  if (category === 'Investments' || salaryCategory === 'Investments') {
    return 'investments';
  }

  if (
    category === 'Utilities & Bills' ||
    FIXED_KEYWORDS.some((keyword) => message.includes(keyword))
  ) {
    return 'fixed';
  }

  if (
    salaryCategory === 'Parents Fund' ||
    salaryCategory === 'Needs' ||
    category === 'Transportation' ||
    category === 'Health & Personal Care' ||
    category === 'Food & Beverages'
  ) {
    return 'flexible-essential';
  }

  return 'discretionary';
}

export function summarizeSpendTruth(
  transactions: TransactionData[],
  options: SpendTruthOptions
): SpendTruthSummary {
  const expenses = transactions.filter((transaction) => transaction['Expense/Income'] === 'Expense');
  const laneCategoryBuckets: Record<SpendTruthLane, Record<string, number>> = {
    fixed: {},
    'flexible-essential': {},
    discretionary: {},
    investments: {},
  };

  for (const transaction of expenses) {
    const lane = classifySpendTruthLane(transaction, options.categoryOverrides);
    laneCategoryBuckets[lane][transaction.Category] =
      (laneCategoryBuckets[lane][transaction.Category] || 0) + transaction.Effective;
  }

  const laneAmounts: Record<SpendTruthLane, number> = {
    fixed: Object.values(laneCategoryBuckets.fixed).reduce((sum, amount) => sum + amount, 0),
    'flexible-essential': Object.values(laneCategoryBuckets['flexible-essential']).reduce((sum, amount) => sum + amount, 0),
    discretionary: Object.values(laneCategoryBuckets.discretionary).reduce((sum, amount) => sum + amount, 0),
    investments: Object.values(laneCategoryBuckets.investments).reduce((sum, amount) => sum + amount, 0),
  };

  const visibleTotal = options.includeInvestments
    ? Object.values(laneAmounts).reduce((sum, amount) => sum + amount, 0)
    : laneAmounts.fixed + laneAmounts['flexible-essential'] + laneAmounts.discretionary;

  return {
    visibleTotal,
    lanes: {
      fixed: {
        lane: 'fixed',
        amount: laneAmounts.fixed,
        percentage: visibleTotal > 0 ? (laneAmounts.fixed / visibleTotal) * 100 : 0,
        categories: summarizeLaneCategories(laneCategoryBuckets.fixed, visibleTotal),
      },
      'flexible-essential': {
        lane: 'flexible-essential',
        amount: laneAmounts['flexible-essential'],
        percentage: visibleTotal > 0 ? (laneAmounts['flexible-essential'] / visibleTotal) * 100 : 0,
        categories: summarizeLaneCategories(laneCategoryBuckets['flexible-essential'], visibleTotal),
      },
      discretionary: {
        lane: 'discretionary',
        amount: laneAmounts.discretionary,
        percentage: visibleTotal > 0 ? (laneAmounts.discretionary / visibleTotal) * 100 : 0,
        categories: summarizeLaneCategories(laneCategoryBuckets.discretionary, visibleTotal),
      },
      investments: {
        lane: 'investments',
        amount: laneAmounts.investments,
        percentage: visibleTotal > 0 ? (laneAmounts.investments / visibleTotal) * 100 : 0,
        categories: summarizeLaneCategories(laneCategoryBuckets.investments, visibleTotal),
      },
    },
  };
}
