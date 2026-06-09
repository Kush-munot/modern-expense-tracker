import test from 'node:test';
import assert from 'node:assert/strict';

import type { TransactionData } from '../types/transaction';
import {
  classifySpendTruthLane,
  summarizeSpendTruth,
} from './spendTruth.ts';

test('classifySpendTruthLane maps utilities to fixed commitments and investments to investments', () => {
  const fixedTransaction: TransactionData = {
    Amount: 999,
    'Expense/Income': 'Expense',
    Date: '6/1/2026',
    ModeOfPayment: 'Credit Card',
    Category: 'Utilities & Bills',
    Message: 'Airtel Recharge',
    SalaryBifercationCat: 'Needs',
    Minus: 0,
    Effective: 999,
  };

  const investmentTransaction: TransactionData = {
    Amount: 5000,
    'Expense/Income': 'Expense',
    Date: '6/2/2026',
    ModeOfPayment: 'UPI',
    Category: 'Investments',
    Message: 'SIP June',
    SalaryBifercationCat: 'Investments',
    Minus: 0,
    Effective: 5000,
  };

  assert.equal(classifySpendTruthLane(fixedTransaction), 'fixed');
  assert.equal(classifySpendTruthLane(investmentTransaction), 'investments');
});

test('classifySpendTruthLane uses salary bucket and category heuristics for discretionary vs flexible essentials', () => {
  const foodNeed: TransactionData = {
    Amount: 180,
    'Expense/Income': 'Expense',
    Date: '6/3/2026',
    ModeOfPayment: 'UPI',
    Category: 'Food & Beverages',
    Message: 'Lunch',
    SalaryBifercationCat: 'Needs',
    Minus: 0,
    Effective: 180,
  };

  const shoppingWant: TransactionData = {
    Amount: 2200,
    'Expense/Income': 'Expense',
    Date: '6/4/2026',
    ModeOfPayment: 'Credit Card',
    Category: 'Shopping',
    Message: 'Sneakers',
    SalaryBifercationCat: 'Wants',
    Minus: 0,
    Effective: 2200,
  };

  assert.equal(classifySpendTruthLane(foodNeed), 'flexible-essential');
  assert.equal(classifySpendTruthLane(shoppingWant), 'discretionary');
});

test('summarizeSpendTruth respects category overrides and can exclude investments from the visible total', () => {
  const transactions: TransactionData[] = [
    {
      Amount: 999,
      'Expense/Income': 'Expense',
      Date: '6/1/2026',
      ModeOfPayment: 'Credit Card',
      Category: 'Utilities & Bills',
      Message: 'Airtel Recharge',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 999,
    },
    {
      Amount: 180,
      'Expense/Income': 'Expense',
      Date: '6/3/2026',
      ModeOfPayment: 'UPI',
      Category: 'Food & Beverages',
      Message: 'Lunch',
      SalaryBifercationCat: 'Needs',
      Minus: 0,
      Effective: 180,
    },
    {
      Amount: 5000,
      'Expense/Income': 'Expense',
      Date: '6/2/2026',
      ModeOfPayment: 'UPI',
      Category: 'Investments',
      Message: 'SIP June',
      SalaryBifercationCat: 'Investments',
      Minus: 0,
      Effective: 5000,
    },
  ];

  const summary = summarizeSpendTruth(transactions, {
    includeInvestments: false,
    categoryOverrides: {
      'Food & Beverages': 'discretionary',
    },
  });

  assert.equal(summary.visibleTotal, 1179);
  assert.equal(summary.lanes.fixed.amount, 999);
  assert.equal(summary.lanes.discretionary.amount, 180);
  assert.equal(summary.lanes.investments.amount, 5000);
  assert.equal(summary.lanes.discretionary.categories[0].category, 'Food & Beverages');
});
