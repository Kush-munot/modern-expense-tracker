import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildQuickAddDraft,
  inferQuickAddSuggestions,
  parseQuickAddInput,
} from './quickAdd';
import type { TransactionData } from '../types/transaction';

test('parseQuickAddInput extracts amount, note, and payment alias from shorthand', () => {
  const parsed = parseQuickAddInput('120 chai upi');

  assert.equal(parsed.amount, 120);
  assert.equal(parsed.note, 'chai');
  assert.equal(parsed.paymentMethod, 'UPI');
});

test('parseQuickAddInput keeps multiple numeric tokens inside the note after the first amount', () => {
  const parsed = parseQuickAddInput('450 recharge 84 days cc');

  assert.equal(parsed.amount, 450);
  assert.equal(parsed.note, 'recharge 84 days');
  assert.equal(parsed.paymentMethod, 'Credit Card');
});

test('parseQuickAddInput understands spoken-style multi-word aliases', () => {
  const parsed = parseQuickAddInput('1500 rent credit card needs utilities and bills');

  assert.equal(parsed.amount, 1500);
  assert.equal(parsed.note, 'rent');
  assert.equal(parsed.paymentMethod, 'Credit Card');
  assert.equal(parsed.salaryCategory, 'Needs');
  assert.equal(parsed.category, 'Utilities & Bills');
});

test('inferQuickAddSuggestions prefers exact historical note matches', () => {
  const history: TransactionData[] = [
    {
      Amount: 30,
      'Expense/Income': 'Expense',
      Date: '1/1/2025',
      ModeOfPayment: 'UPI',
      Category: 'Transportation',
      Message: 'bus',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 30,
    },
    {
      Amount: 35,
      'Expense/Income': 'Expense',
      Date: '1/2/2025',
      ModeOfPayment: 'UPI',
      Category: 'Transportation',
      Message: 'bus',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 35,
    },
  ];

  const suggestions = inferQuickAddSuggestions('bus', history);

  assert.equal(suggestions.category, 'Transportation');
  assert.equal(suggestions.salaryCategory, 'Needs');
  assert.equal(suggestions.paymentMethod, 'UPI');
});

test('buildQuickAddDraft combines parsed input and inferred suggestions into a save-ready draft', () => {
  const history: TransactionData[] = [
    {
      Amount: 130,
      'Expense/Income': 'Expense',
      Date: '1/3/2025',
      ModeOfPayment: 'UPI',
      Category: 'Food & Beverages',
      Message: 'lunch',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 130,
    },
  ];

  const draft = buildQuickAddDraft('130 lunch upi', history);

  assert.equal(draft.amount, 130);
  assert.equal(draft.note, 'lunch');
  assert.equal(draft.paymentMethod, 'UPI');
  assert.equal(draft.category, 'Food & Beverages');
  assert.equal(draft.salaryCategory, 'Needs');
  assert.equal(draft.canSubmit, true);
});

test('buildQuickAddDraft respects spoken salary-category and category aliases', () => {
  const draft = buildQuickAddDraft('500 sip investments upi', []);

  assert.equal(draft.amount, 500);
  assert.equal(draft.note, 'sip');
  assert.equal(draft.paymentMethod, 'UPI');
  assert.equal(draft.category, 'Investments');
  assert.equal(draft.salaryCategory, 'Investments');
});
