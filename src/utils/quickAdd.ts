import type { TransactionData } from '../types/transaction';

export interface QuickAddParsedInput {
  amount: number | null;
  note: string;
  paymentMethod: string;
  salaryCategory: string;
  category: string;
}

export interface QuickAddSuggestions {
  category: string;
  salaryCategory: string;
  paymentMethod: string;
}

export interface QuickAddDraft extends QuickAddSuggestions {
  amount: number | null;
  note: string;
  canSubmit: boolean;
}

const PAYMENT_ALIASES: Array<{ phrase: string; value: string }> = [
  { phrase: 'credit card', value: 'Credit Card' },
  { phrase: 'cc', value: 'Credit Card' },
  { phrase: 'credit', value: 'Credit Card' },
  { phrase: 'upi', value: 'UPI' },
  { phrase: 'cash', value: 'Cash' },
];

const SALARY_CATEGORY_ALIASES: Array<{ phrase: string; value: string }> = [
  { phrase: 'parents fund', value: 'Parents Fund' },
  { phrase: 'investments', value: 'Investments' },
  { phrase: 'investment', value: 'Investments' },
  { phrase: 'needs', value: 'Needs' },
  { phrase: 'wants', value: 'Wants' },
  { phrase: 'trips', value: 'Trips' },
  { phrase: 'trip', value: 'Trips' },
];

const CATEGORY_ALIASES: Array<{ phrase: string; value: string }> = [
  { phrase: 'utilities and bills', value: 'Utilities & Bills' },
  { phrase: 'utility bill', value: 'Utilities & Bills' },
  { phrase: 'food and beverages', value: 'Food & Beverages' },
  { phrase: 'food', value: 'Food & Beverages' },
  { phrase: 'beverages', value: 'Food & Beverages' },
  { phrase: 'health and personal care', value: 'Health & Personal Care' },
  { phrase: 'shopping', value: 'Shopping' },
  { phrase: 'transportation', value: 'Transportation' },
  { phrase: 'travel', value: 'Travel' },
  { phrase: 'investments', value: 'Investments' },
  { phrase: 'miscellaneous', value: 'Miscellaneous' },
  { phrase: 'entertainment and leisure', value: 'Entertainment & Leisure' },
];

const KEYWORD_SUGGESTIONS: Array<{
  matchers: string[];
  category: string;
  salaryCategory: string;
}> = [
  {
    matchers: ['bus', 'metro', 'auto', 'cab', 'uber', 'ola', 'train'],
    category: 'Transportation',
    salaryCategory: 'Needs',
  },
  {
    matchers: ['coffee', 'tea', 'chai', 'lunch', 'dinner', 'breakfast', 'milk', 'vegetable'],
    category: 'Food & Beverages',
    salaryCategory: 'Needs',
  },
  {
    matchers: ['rent', 'subscription', 'internet', 'electricity', 'recharge', 'wifi', 'bill'],
    category: 'Utilities & Bills',
    salaryCategory: 'Needs',
  },
  {
    matchers: ['sip', 'mutual fund', 'stocks', 'investment'],
    category: 'Investments',
    salaryCategory: 'Investments',
  },
  {
    matchers: ['ticket', 'trip', 'travel', 'flight', 'hotel'],
    category: 'Travel',
    salaryCategory: 'Wants',
  },
];

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function removePhrase(input: string, phrase: string): string {
  const pattern = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return input.replace(pattern, ' ').replace(/\s+/g, ' ').trim();
}

function extractAlias(
  input: string,
  aliases: Array<{ phrase: string; value: string }>
): { value: string; remaining: string } {
  let remaining = normalizeText(input);

  for (const alias of aliases.sort((a, b) => b.phrase.length - a.phrase.length)) {
    const pattern = new RegExp(`\\b${alias.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (pattern.test(remaining)) {
      remaining = removePhrase(remaining, alias.phrase);
      return {
        value: alias.value,
        remaining,
      };
    }
  }

  return {
    value: '',
    remaining,
  };
}

function getKeywordSuggestion(note: string): QuickAddSuggestions {
  const normalizedNote = normalizeText(note);

  for (const suggestion of KEYWORD_SUGGESTIONS) {
    if (suggestion.matchers.some((matcher) => normalizedNote.includes(matcher))) {
      return {
        category: suggestion.category,
        salaryCategory: suggestion.salaryCategory,
        paymentMethod: '',
      };
    }
  }

  return {
    category: '',
    salaryCategory: '',
    paymentMethod: '',
  };
}

export function parseQuickAddInput(input: string): QuickAddParsedInput {
  const normalizedInput = normalizeText(input);
  const payment = extractAlias(normalizedInput, PAYMENT_ALIASES);
  const salaryCategory = extractAlias(payment.remaining, SALARY_CATEGORY_ALIASES);
  const category = extractAlias(salaryCategory.remaining, CATEGORY_ALIASES);

  const tokens = category.remaining.split(/\s+/).filter(Boolean);
  let amount: number | null = null;
  const noteTokens: string[] = [];

  for (const token of tokens) {
    const numericValue = Number(token.replace(/,/g, ''));

    if (amount === null && Number.isFinite(numericValue) && token !== '') {
      amount = numericValue;
      continue;
    }

    noteTokens.push(token);
  }

  return {
    amount,
    note: noteTokens.join(' ').trim(),
    paymentMethod: payment.value,
    salaryCategory: salaryCategory.value,
    category: category.value,
  };
}

export function inferQuickAddSuggestions(note: string, history: TransactionData[]): QuickAddSuggestions {
  const normalizedNote = normalizeText(note);
  const exactMatches = history.filter(
    (transaction) =>
      transaction['Expense/Income'] === 'Expense' &&
      normalizeText(transaction.Message) === normalizedNote
  );

  if (exactMatches.length > 0) {
    const latestMatch = exactMatches[exactMatches.length - 1];
    return {
      category: latestMatch.Category,
      salaryCategory: latestMatch.SalaryBifercationCat,
      paymentMethod: latestMatch.ModeOfPayment,
    };
  }

  return getKeywordSuggestion(note);
}

export function buildQuickAddDraft(input: string, history: TransactionData[]): QuickAddDraft {
  const parsed = parseQuickAddInput(input);
  const suggestions = inferQuickAddSuggestions(parsed.note, history);

  return {
    amount: parsed.amount,
    note: parsed.note,
    paymentMethod: parsed.paymentMethod || suggestions.paymentMethod,
    category: parsed.category || suggestions.category || 'Miscellaneous',
    salaryCategory: parsed.salaryCategory || suggestions.salaryCategory || 'Needs',
    canSubmit: parsed.amount !== null && parsed.note.length > 0,
  };
}
