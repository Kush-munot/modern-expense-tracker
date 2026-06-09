import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Assessment, CreditCard, CompareArrows, Toll } from '@mui/icons-material';
import CardComponent from '../CardComponent/CardComponent';
import { TransactionData, BASE_MONTHLY_INCOME } from '../../types/transaction';
import { calculateAverageDailyExpense } from '../../utils/analytics';

interface AnalyticsSummaryProps {
  transactions: TransactionData[];
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ transactions }) => {
  const analytics = React.useMemo(() => {
    let totalExpenses = 0;
    let additionalIncome = 0;

    transactions.forEach((transaction) => {
      if (transaction['Expense/Income'] === 'Income') {
        additionalIncome += transaction.Amount;
      } else {
        totalExpenses += transaction.Effective;
      }
    });

    const totalIncome = BASE_MONTHLY_INCOME + additionalIncome;
    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    const categoryExpenses = transactions
      .filter((transaction) => transaction['Expense/Income'] === 'Expense')
      .reduce((acc, transaction) => {
        acc[transaction.Category] = (acc[transaction.Category] || 0) + transaction.Effective;
        return acc;
      }, {} as Record<string, number>);

    const topExpenseCategory = Object.entries(categoryExpenses).sort(([, a], [, b]) => b - a)[0];

    const paymentMethods = transactions.reduce((acc, transaction) => {
      acc[transaction.ModeOfPayment] = (acc[transaction.ModeOfPayment] || 0) + transaction.Amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIncome,
      baseIncome: BASE_MONTHLY_INCOME,
      additionalIncome,
      totalExpenses,
      netBalance,
      topExpenseCategory,
      paymentMethods,
      avgDailyExpense: calculateAverageDailyExpense(transactions),
      transactionCount: transactions.length,
      savingsRate,
      hasAdditionalIncome: additionalIncome > 0,
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: '#1c1917',
    color: '#f2f2f2',
    borderRadius: '15px',
    height: '100%',
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#a3a3a3">
                    Total Income {analytics.hasAdditionalIncome ? `(₹${analytics.baseIncome.toLocaleString()} + ₹${analytics.additionalIncome.toLocaleString()})` : '(Base)'}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#22c55e">
                    ₹{analytics.totalIncome.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp sx={{ color: '#22c55e' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#a3a3a3">
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#ef4444">
                    ₹{analytics.totalExpenses.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingDown sx={{ color: '#ef4444' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#a3a3a3">
                    Net Balance
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={analytics.netBalance >= 0 ? '#22c55e' : '#ef4444'}
                  >
                    ₹{analytics.netBalance.toLocaleString()}
                  </Typography>
                </Box>
                <AccountBalance sx={{ color: analytics.netBalance >= 0 ? '#22c55e' : '#ef4444' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#a3a3a3">
                    Savings Rate
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={analytics.savingsRate >= 0 ? '#22c55e' : '#ef4444'}
                  >
                    {analytics.savingsRate.toFixed(1)}%
                  </Typography>
                </Box>
                <Assessment sx={{ color: '#3b82f6' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CardComponent
                label="Credit Card Expense"
                icon={CreditCard}
                amount={`₹${(analytics.paymentMethods['Credit Card'] || 0).toLocaleString()}`}
                description="Spent on current-cycle purchases via Credit Card"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardComponent
                label="UPI Expenses"
                icon={CompareArrows}
                amount={`₹${(analytics.paymentMethods['UPI'] || 0).toLocaleString()}`}
                description="Spent on current-cycle purchases via UPI"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardComponent
                label="Cash Expenses"
                icon={Toll}
                amount={`₹${(analytics.paymentMethods['Cash'] || 0).toLocaleString()}`}
                description="Spent on current-cycle purchases via Cash"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                Key Insights
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                <Chip
                  label={`${analytics.topExpenseCategory?.[0] || 'No top category'}: ₹${analytics.topExpenseCategory?.[1]?.toLocaleString() || 0}`}
                  sx={{ backgroundColor: '#7f1d1d', color: '#fff' }}
                />
                <Chip
                  label={`Average daily expense: ₹${analytics.avgDailyExpense.toFixed(0)}`}
                  sx={{ backgroundColor: '#18181b', color: '#f2f2f2' }}
                />
                <Chip
                  label={`Transactions this cycle: ${analytics.transactionCount}`}
                  sx={{ backgroundColor: '#18181b', color: '#f2f2f2' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsSummary;
