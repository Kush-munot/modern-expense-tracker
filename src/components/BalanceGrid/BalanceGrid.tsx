import React from 'react'
import Card from '../CardComponent/CardComponent';
import { AccountBalanceWallet, Toll, CompareArrows, CreditCard } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';

interface apiData {
  "Amount": number;
  "Expense/Income": string;
  "Date": string;
  "ModeOfPayment": string;
  "Category": string;
  "Message": string;
  "SalaryBifercationCat": string;
  "Minus": number;
  "Effective": number;
}

const BalanceGrid = (props: { allTransactions: apiData[]; }) => {
  const [balance, setBalance] = React.useState(0);
  const [creditCard, setCreditCard] = React.useState(0);
  const [upi, setUpi] = React.useState(0);
  const [cash, setCash] = React.useState(0);

  const roundedToTwoDecimals = (value: number) => {
    return Number(value.toFixed(2));
  };

  React.useEffect(() => {
    // Process transactions to calculate balances and expenses
    let currentBalance = 0;
    let creditExpense = 0;
    let cashExp = 0;
    let upiExp = 0;

    props.allTransactions.forEach((transaction: apiData) => {
      if (transaction["Expense/Income"] === "Income") {
        currentBalance += transaction.Amount;
      } else {
        currentBalance -= transaction.Effective;
        if (transaction.ModeOfPayment === "Credit Card") {
          creditExpense += transaction.Amount;
        } else if (transaction.ModeOfPayment === "Cash") {
          cashExp += transaction.Amount;
        } else if (transaction.ModeOfPayment === "UPI") {
          upiExp += transaction.Amount;
        }
      }
    });

    setBalance(roundedToTwoDecimals(currentBalance));
    setCreditCard(roundedToTwoDecimals(creditExpense));
    setCash(roundedToTwoDecimals(cashExp));
    setUpi(roundedToTwoDecimals(upiExp));
  }, [props.allTransactions]);

  return (
    <Box padding={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            label="Total Expense"
            icon={AccountBalanceWallet}
            amount={"₹" + (Math.abs(balance))}
            description="Total expenses across all purchases"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            label="Credit Card Expense"
            icon={CreditCard}
            amount={"₹" + creditCard}
            description="Spent on recent purchases via Credit Card"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            label="UPI Expenses"
            icon={CompareArrows}
            amount={"₹" + upi}
            description="Spent on recent purchases via Debit Card or UPI"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            label="Cash Expenses"
            icon={Toll}
            amount={"₹" + cash}
            description="Spent on recent purchases via Cash"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default BalanceGrid