import test from 'node:test';
import assert from 'node:assert/strict';

import type { TransactionData } from '../types/transaction';
import {
  buildManualTemplate,
  deriveSuggestedTemplates,
  normalizeTemplateName,
} from './templates';

test('normalizeTemplateName trims extra whitespace', () => {
  assert.equal(normalizeTemplateName('  Bus   to   PG  '), 'Bus to PG');
});

test('buildManualTemplate creates a favorite template with stable defaults', () => {
  const template = buildManualTemplate({
    name: 'Coffee',
    amount: 120,
    category: 'Food & Beverages',
    modeOfPayment: 'UPI',
    salaryBifercationCat: 'Wants',
    message: 'Coffee',
  });

  assert.equal(template.name, 'Coffee');
  assert.equal(template.amount, 120);
  assert.equal(template.source, 'manual');
  assert.equal(template.isFavorite, true);
  assert.equal(template.transactionType, 'Expense');
});

test('deriveSuggestedTemplates returns the most frequent historical templates', () => {
  const history: TransactionData[] = [
    {
      Amount: 30,
      'Expense/Income': 'Expense',
      Date: '1/1/2025',
      ModeOfPayment: 'Credit Card',
      Category: 'Transportation',
      Message: 'Bus to PG',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 30,
    },
    {
      Amount: 30,
      'Expense/Income': 'Expense',
      Date: '1/2/2025',
      ModeOfPayment: 'Credit Card',
      Category: 'Transportation',
      Message: 'Bus to PG',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 30,
    },
    {
      Amount: 40,
      'Expense/Income': 'Expense',
      Date: '1/3/2025',
      ModeOfPayment: 'UPI',
      Category: 'Transportation',
      Message: 'Auto',
      SalaryBifercationCat: 'Trips',
      Minus: 0,
      Effective: 40,
    },
  ];

  const templates = deriveSuggestedTemplates(history, 3);

  assert.equal(templates.length, 1);
  assert.equal(templates[0].name, 'Bus to PG');
  assert.equal(templates[0].usageCount, 2);
  assert.equal(templates[0].source, 'suggested');
});
