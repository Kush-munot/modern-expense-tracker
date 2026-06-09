import type { TransactionData } from '../types/transaction';

export type TransactionTemplateSource = 'manual' | 'suggested';

export interface TransactionTemplate {
  id: string;
  name: string;
  transactionType: 'Income' | 'Expense';
  amount: number | null;
  category: string;
  modeOfPayment: string;
  salaryBifercationCat: string;
  message: string;
  isFavorite: boolean;
  source: TransactionTemplateSource;
  usageCount: number;
  lastUsedAt: string;
}

export interface BuildManualTemplateInput {
  name: string;
  amount: number | null;
  category: string;
  modeOfPayment: string;
  salaryBifercationCat: string;
  message: string;
}

export const TEMPLATE_STORAGE_KEY = 'expense-tracker-templates-v1';

export function normalizeTemplateName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function slugify(value: string): string {
  return normalizeTemplateName(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function buildManualTemplate(input: BuildManualTemplateInput): TransactionTemplate {
  const normalizedName = normalizeTemplateName(input.name || input.message || 'New Template');
  const now = new Date().toISOString();

  return {
    id: `manual-${slugify(normalizedName)}-${Date.now()}`,
    name: normalizedName,
    transactionType: 'Expense',
    amount: input.amount,
    category: input.category,
    modeOfPayment: input.modeOfPayment,
    salaryBifercationCat: input.salaryBifercationCat,
    message: input.message,
    isFavorite: true,
    source: 'manual',
    usageCount: 0,
    lastUsedAt: now,
  };
}

export function deriveSuggestedTemplates(
  history: TransactionData[],
  limit = 6
): TransactionTemplate[] {
  const grouped = new Map<string, { count: number; latest: TransactionData }>();

  for (const transaction of history) {
    if (
      transaction['Expense/Income'] !== 'Expense' ||
      !transaction.Message?.trim()
    ) {
      continue;
    }

    const key = [
      normalizeTemplateName(transaction.Message).toLowerCase(),
      transaction.Category,
      transaction.ModeOfPayment,
      transaction.SalaryBifercationCat,
    ].join('::');

    const existing = grouped.get(key);
    if (existing) {
      existing.count += 1;
      existing.latest = transaction;
    } else {
      grouped.set(key, { count: 1, latest: transaction });
    }
  }

  return Array.from(grouped.values())
    .filter((entry) => entry.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ count, latest }) => ({
      id: `suggested-${slugify(latest.Message)}-${slugify(latest.Category)}`,
      name: normalizeTemplateName(latest.Message),
      transactionType: 'Expense',
      amount: latest.Effective ?? latest.Amount ?? null,
      category: latest.Category,
      modeOfPayment: latest.ModeOfPayment,
      salaryBifercationCat: latest.SalaryBifercationCat,
      message: latest.Message,
      isFavorite: false,
      source: 'suggested',
      usageCount: count,
      lastUsedAt: latest.Date,
    }));
}
