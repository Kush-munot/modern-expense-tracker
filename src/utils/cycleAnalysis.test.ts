import test from 'node:test';
import assert from 'node:assert/strict';

import type { TransactionData } from '../types/transaction';
import {
  analyzeCycleChanges,
  getCycleBounds,
  getTransactionsForCycle,
} from './cycleAnalysis';

test('getCycleBounds returns a 15th-to-14th cycle for a mid-cycle date', () => {
  const cycle = getCycleBounds(new Date('2026-06-08T00:00:00Z'));

  assert.equal(cycle.id, '2026-05-15_to_2026-06-14');
  assert.equal(cycle.start, '2026-05-15');
  assert.equal(cycle.end, '2026-06-14');
});

test('getCycleBounds returns a new cycle starting on the 15th', () => {
  const cycle = getCycleBounds(new Date('2026-06-15T00:00:00Z'));

  assert.equal(cycle.id, '2026-06-15_to_2026-07-14');
  assert.equal(cycle.start, '2026-06-15');
  assert.equal(cycle.end, '2026-07-14');
});

test('analyzeCycleChanges identifies major category increases and large transactions', () => {
  const transactions: TransactionData[] = [
    {
      Amount: 4000,
      'Expense/Income': 'Expense',
      Date: '5/20/2026',
      ModeOfPayment: 'Credit Card',
      Category: 'Utilities & Bills',
      Message: 'Internet + recharge',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 4000,
    },
    {
      Amount: 3000,
      'Expense/Income': 'Expense',
      Date: '5/28/2026',
      ModeOfPayment: 'UPI',
      Category: 'Travel',
      Message: 'Trip booking',
      SalaryBifercationCat: 'Wants',
      Minus: 0,
      Effective: 3000,
    },
    {
      Amount: 600,
      'Expense/Income': 'Expense',
      Date: '4/20/2026',
      ModeOfPayment: 'Credit Card',
      Category: 'Utilities & Bills',
      Message: 'Internet + recharge',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 600,
    },
    {
      Amount: 1200,
      'Expense/Income': 'Expense',
      Date: '4/22/2026',
      ModeOfPayment: 'UPI',
      Category: 'Food & Beverages',
      Message: 'Dining out',
      SalaryBifercationCat: 'Wants',
      Minus: 0,
      Effective: 1200,
    },
  ];

  const analysis = analyzeCycleChanges(transactions, new Date('2026-06-08T00:00:00Z'));

  assert.equal(analysis.currentCycle.id, '2026-05-15_to_2026-06-14');
  assert.equal(analysis.previousCycle.id, '2026-04-15_to_2026-05-14');
  assert.equal(analysis.topIncreases[0].category, 'Utilities & Bills');
  assert.equal(analysis.topIncreases[0].delta, 3400);
  assert.equal(analysis.newCategories[0], 'Travel');
  assert.equal(analysis.largeTransactions[0].message, 'Internet + recharge');
});

test('getTransactionsForCycle filters the master ledger down to the current cycle only', () => {
  const transactions: TransactionData[] = [
    {
      Amount: 100,
      'Expense/Income': 'Expense',
      Date: '5/20/2026',
      ModeOfPayment: 'UPI',
      Category: 'Food & Beverages',
      Message: 'Lunch',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 100,
    },
    {
      Amount: 200,
      'Expense/Income': 'Expense',
      Date: '5/14/2026',
      ModeOfPayment: 'UPI',
      Category: 'Food & Beverages',
      Message: 'Dinner',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 200,
    },
  ];

  const cycle = getCycleBounds(new Date('2026-06-08T00:00:00Z'));
  const filtered = getTransactionsForCycle(transactions, cycle);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].Message, 'Lunch');
});
