import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Chip } from '@mui/material';
import { TransactionData } from '../../types/transaction';

interface QuickStatsProps {
  transactions: TransactionData[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ transactions }) => {
  const stats = React.useMemo(() => {
    const expenses = transactions.filter((transaction) => transaction['Expense/Income'] === 'Expense');
    const income = transactions
      .filter((transaction) => transaction['Expense/Income'] === 'Income')
      .slice()
      .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

    const largestExpense = expenses.slice().sort((a, b) => b.Effective - a.Effective)[0];
    const latestIncome = income[0];

    const categoryCounts = expenses.reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.Category] = (acc[transaction.Category] || 0) + 1;
      return acc;
    }, {});

    const mostActiveCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];

    return {
      largestExpense,
      latestIncome,
      mostActiveCategory,
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: '#1c1917',
    color: '#f2f2f2',
    borderRadius: '15px',
    height: '100%',
    border: '1px solid #292524',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h4"
        sx={{
          color: '#22c55e',
          marginBottom: 3,
          fontWeight: 'bold',
          fontSize: '22px',
          '@media (max-width:540px)': {
            fontSize: '1.3rem',
          },
        }}
      >
        Quick Transaction Stats
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#ef4444', marginBottom: 2 }}>
                Largest Expense
              </Typography>
              {stats.largestExpense ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.largestExpense.Message || `${stats.largestExpense.Category} transaction`}
                  </Typography>
                  <Chip
                    label={stats.largestExpense.Category}
                    sx={{ width: 'fit-content', backgroundColor: '#7f1d1d', color: '#fff' }}
                  />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#ef4444' }}>
                    -₹{stats.largestExpense.Effective.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    {stats.largestExpense.ModeOfPayment} on {formatDate(stats.largestExpense.Date)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="#a3a3a3">
                  No expenses found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                Latest Income
              </Typography>
              {stats.latestIncome ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.latestIncome.Message || 'Income transaction'}
                  </Typography>
                  <Chip
                    label={stats.latestIncome.ModeOfPayment}
                    sx={{ width: 'fit-content', backgroundColor: '#166534', color: '#fff' }}
                  />
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#22c55e' }}>
                    +₹{stats.latestIncome.Amount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    {formatDate(stats.latestIncome.Date)}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="#a3a3a3">
                  No income found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#3b82f6', marginBottom: 2 }}>
                Most Active Category
              </Typography>
              {stats.mostActiveCategory ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.mostActiveCategory[0]}
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: '#3b82f6' }}>
                    {stats.mostActiveCategory[1]}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    expense transactions in the current cycle
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h6" color="#a3a3a3">
                  No categories found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickStats;
