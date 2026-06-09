import { TransactionData } from '../types/transaction';

export interface CreateTransactionInput {
  amount: number;
  transactionType: 'Income' | 'Expense';
  paymentMethod: string;
  category: string;
  message: string;
  salaryCategory: string;
  splitAmount?: number;
  date?: Date;
}

export function getFormattedDate(dateTime: Date): string {
  return `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()}`;
}

export function buildTransactionPayload(input: CreateTransactionInput): TransactionData {
  const splitAmount = input.splitAmount ?? 0;

  return {
    Amount: input.amount,
    'Expense/Income': input.transactionType,
    Date: getFormattedDate(input.date ?? new Date()),
    ModeOfPayment: input.paymentMethod,
    Category: input.category,
    Message: input.message,
    SalaryBifercationCat: input.salaryCategory,
    Minus: splitAmount,
    Effective: input.amount - splitAmount,
  };
}

export async function submitTransaction(input: CreateTransactionInput): Promise<TransactionData> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const transaction = buildTransactionPayload(input);

  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'no-cors',
    body: JSON.stringify(transaction),
  });

  return transaction;
}
