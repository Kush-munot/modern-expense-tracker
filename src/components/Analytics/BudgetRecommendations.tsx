import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { LightbulbOutlined, TrendingDown, Timeline, Warning, CheckCircle } from '@mui/icons-material';
import { TransactionData, BASE_MONTHLY_INCOME } from '../../types/transaction';

interface BudgetRecommendationsProps {
  transactions: TransactionData[];
}

const BudgetRecommendations: React.FC<BudgetRecommendationsProps> = ({ transactions }) => {
  const recommendations = React.useMemo(() => {
    const expenses = transactions.filter((transaction) => transaction['Expense/Income'] === 'Expense');
    const incomeTransactions = transactions.filter((transaction) => transaction['Expense/Income'] === 'Income');

    const additionalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.Amount, 0);
    const totalIncome = BASE_MONTHLY_INCOME + additionalIncome;
    const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.Effective, 0);

    const needsExpenses = expenses
      .filter((transaction) => transaction.SalaryBifercationCat === 'Needs')
      .reduce((sum, transaction) => sum + transaction.Effective, 0);
    const wantsExpenses = expenses
      .filter((transaction) => transaction.SalaryBifercationCat === 'Wants')
      .reduce((sum, transaction) => sum + transaction.Effective, 0);

    const needsPercentage = totalIncome > 0 ? (needsExpenses / totalIncome) * 100 : 0;
    const wantsPercentage = totalIncome > 0 ? (wantsExpenses / totalIncome) * 100 : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const categoryExpenses = expenses.reduce((acc, transaction) => {
      acc[transaction.Category] = (acc[transaction.Category] || 0) + transaction.Effective;
      return acc;
    }, {} as Record<string, number>);

    const nextRecommendations: Array<{
      type: 'error' | 'warning' | 'info' | 'success';
      category: string;
      title: string;
      message: string;
      suggestion: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
    }> = [];

    if (savingsRate < 0) {
      nextRecommendations.push({
        type: 'error',
        category: 'Savings',
        title: 'You are overspending',
        message: `You are spending ${Math.abs(savingsRate).toFixed(1)}% more than your income this cycle.`,
        suggestion: 'Cut non-essential expenses immediately or add short-term income before the cycle closes.',
        priority: 'critical',
      });
    } else if (savingsRate < 20) {
      nextRecommendations.push({
        type: 'info',
        category: 'Savings',
        title: 'Increase your savings rate',
        message: `Savings are at ${savingsRate.toFixed(1)}% versus the 20% target.`,
        suggestion: 'Trim wants spending first or move one discretionary purchase to the next cycle.',
        priority: 'high',
      });
    }

    if (needsPercentage > 50) {
      nextRecommendations.push({
        type: 'warning',
        category: 'Needs Budget',
        title: 'Needs are running high',
        message: `Needs are at ${needsPercentage.toFixed(1)}% of income.`,
        suggestion: 'Review utilities, travel, or recurring fixed costs for one reduction opportunity.',
        priority: 'high',
      });
    }

    if (wantsPercentage > 30) {
      nextRecommendations.push({
        type: 'warning',
        category: 'Wants Budget',
        title: 'Wants are above target',
        message: `Wants are at ${wantsPercentage.toFixed(1)}% of income.`,
        suggestion: 'Delay one discretionary purchase and use the rest of the cycle for low-spend days.',
        priority: 'medium',
      });
    }

    const foodExpenses = categoryExpenses['Food & Beverages'] || 0;
    const foodPercentage = totalIncome > 0 ? (foodExpenses / totalIncome) * 100 : 0;
    if (foodPercentage > 15) {
      nextRecommendations.push({
        type: 'info',
        category: 'Food & Beverages',
        title: 'Food spending is elevated',
        message: `Food is using ${foodPercentage.toFixed(1)}% of cycle income.`,
        suggestion: 'Use meal planning or home-first days to cool this category down.',
        priority: 'medium',
      });
    }

    const shoppingExpenses = categoryExpenses['Shopping'] || 0;
    const shoppingPercentage = totalIncome > 0 ? (shoppingExpenses / totalIncome) * 100 : 0;
    if (shoppingPercentage > 10) {
      nextRecommendations.push({
        type: 'info',
        category: 'Shopping',
        title: 'Shopping deserves a pause',
        message: `Shopping is at ${shoppingPercentage.toFixed(1)}% of cycle income.`,
        suggestion: 'Use a 24-hour pause rule before any more non-essential purchases this cycle.',
        priority: 'low',
      });
    }

    const sortedRecommendations = nextRecommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return {
      primaryRecommendations: sortedRecommendations.slice(0, 3),
      healthySummary:
        sortedRecommendations.length === 0
          ? savingsRate >= 20
            ? 'Savings are healthy for this cycle. No urgent corrections right now.'
            : 'No major issues detected. Keep tracking to hold the current balance.'
          : '',
      budgetBreakdown: {
        needsPercentage,
        wantsPercentage,
        savingsRate,
      },
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: '#1c1917',
    color: '#f2f2f2',
    borderRadius: '15px',
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <Warning sx={{ color: '#ef4444' }} />;
      case 'warning':
        return <TrendingDown sx={{ color: '#f59e0b' }} />;
      case 'info':
        return <LightbulbOutlined sx={{ color: '#3b82f6' }} />;
      case 'success':
        return <Timeline sx={{ color: '#22c55e' }} />;
      default:
        return <LightbulbOutlined sx={{ color: '#6b7280' }} />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'error':
        return '#7f1d1d';
      case 'warning':
        return '#78350f';
      case 'info':
        return '#1e3a8a';
      case 'success':
        return '#166534';
      default:
        return '#374151';
    }
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
        Smart Budget Recommendations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
                <Chip
                  label={`Savings ${recommendations.budgetBreakdown.savingsRate.toFixed(1)}%`}
                  sx={{ backgroundColor: '#18181b', color: '#f2f2f2' }}
                />
                <Chip
                  label={`Needs ${recommendations.budgetBreakdown.needsPercentage.toFixed(1)}%`}
                  sx={{ backgroundColor: '#18181b', color: '#f2f2f2' }}
                />
                <Chip
                  label={`Wants ${recommendations.budgetBreakdown.wantsPercentage.toFixed(1)}%`}
                  sx={{ backgroundColor: '#18181b', color: '#f2f2f2' }}
                />
              </Box>

              {recommendations.primaryRecommendations.length > 0 ? (
                <Box>
                  {recommendations.primaryRecommendations.map((recommendation, index) => (
                    <Box key={`rec-${index}`} sx={{ marginBottom: index === recommendations.primaryRecommendations.length - 1 ? 0 : 2 }}>
                      <Box
                        sx={{
                          padding: 2,
                          backgroundColor: getRecommendationColor(recommendation.type),
                          borderRadius: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 1 }}>
                          {getRecommendationIcon(recommendation.type)}
                          <Box sx={{ marginLeft: 1, flex: 1 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 1,
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                {recommendation.title}
                              </Typography>
                              <Chip
                                label={recommendation.category}
                                size="medium"
                                sx={{ backgroundColor: '#374151', color: '#f3f4f6', fontSize: '1rem' }}
                              />
                            </Box>
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                              {recommendation.message}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#d1d5db', fontStyle: 'italic' }}>
                              Action: {recommendation.suggestion}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    padding: 2.5,
                    backgroundColor: '#14532d',
                    borderRadius: 2,
                  }}
                >
                  <CheckCircle sx={{ color: '#86efac' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      No urgent recommendation right now
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#d1fae5' }}>
                      {recommendations.healthySummary}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BudgetRecommendations;
