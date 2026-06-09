import test from 'node:test';
import assert from 'node:assert/strict';
import {
  summarizeBudgetRecommendations,
  summarizeQuickStats,
  summarizeSpendingPatterns,
} from './dashboardDisclosure';
import type { TransactionData } from '../types/transaction';

function transaction(input: Partial<TransactionData>): TransactionData {
  return {
    Amount: 0,
    'Expense/Income': 'Expense',
    Date: '2026-06-01',
    ModeOfPayment: 'UPI',
    Category: 'Food & Beverages',
    Message: 'Lunch',
    SalaryBifercationCat: 'Needs',
    Minus: '',
    Effective: 0,
    ...input,
  };
}

test('summarizeQuickStats highlights largest expense and most active category', () => {
  const summary = summarizeQuickStats([
    transaction({ Effective: 120, Amount: 120, Category: 'Food & Beverages' }),
    transaction({ Effective: 1800, Amount: 1800, Category: 'Travel', Message: 'Trip' }),
    transaction({ Effective: 220, Amount: 220, Category: 'Food & Beverages', Message: 'Dinner' }),
  ]);

  assert.deepEqual(summary, [
    { label: 'Largest', value: '₹1,800' },
    { label: 'Active', value: 'Food & Beverages (2)' },
  ]);
});

test('summarizeSpendingPatterns reports top category share and wants share', () => {
  const summary = summarizeSpendingPatterns([
    transaction({ Effective: 500, Amount: 500, Category: 'Travel', SalaryBifercationCat: 'Wants' }),
    transaction({ Effective: 500, Amount: 500, Category: 'Travel', SalaryBifercationCat: 'Wants' }),
    transaction({ Effective: 1000, Amount: 1000, Category: 'Food & Beverages', SalaryBifercationCat: 'Needs' }),
  ]);

  assert.deepEqual(summary, [
    { label: 'Top category', value: 'Travel (50%)' },
    { label: 'Wants share', value: '50%' },
  ]);
});

test('summarizeBudgetRecommendations reports savings rate and alert count', () => {
  const summary = summarizeBudgetRecommendations([
    transaction({ Effective: 50000, Amount: 50000, Category: 'Travel', SalaryBifercationCat: 'Needs' }),
    transaction({ Effective: 20000, Amount: 20000, Category: 'Shopping', SalaryBifercationCat: 'Wants' }),
  ]);

  assert.deepEqual(summary, [
    { label: 'Savings', value: '21.3%' },
    { label: 'Alerts', value: '1' },
  ]);
});
