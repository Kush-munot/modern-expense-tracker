import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TransactionData } from '../../types/transaction';

interface SpendingPatternsProps {
  transactions: TransactionData[];
}

const SpendingPatterns: React.FC<SpendingPatternsProps> = ({ transactions }) => {
  const patterns = React.useMemo(() => {
    const expenses = transactions.filter((transaction) => transaction['Expense/Income'] === 'Expense');
    const totalExpenses = expenses.reduce((sum, transaction) => sum + transaction.Effective, 0);

    const categoryBreakdown = expenses.reduce((acc, transaction) => {
      if (!acc[transaction.Category]) {
        acc[transaction.Category] = { amount: 0, count: 0, percentage: 0 };
      }
      acc[transaction.Category].amount += transaction.Effective;
      acc[transaction.Category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number; percentage: number }>);

    Object.keys(categoryBreakdown).forEach((category) => {
      categoryBreakdown[category].percentage =
        totalExpenses > 0 ? (categoryBreakdown[category].amount / totalExpenses) * 100 : 0;
    });

    const salaryCategories = expenses.reduce((acc, transaction) => {
      if (!acc[transaction.SalaryBifercationCat]) {
        acc[transaction.SalaryBifercationCat] = { amount: 0, count: 0 };
      }
      acc[transaction.SalaryBifercationCat].amount += transaction.Effective;
      acc[transaction.SalaryBifercationCat].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return {
      categoryBreakdown,
      salaryCategories,
      totalExpenses,
    };
  }, [transactions]);

  const getProgressColor = (percentage: number) => {
    if (percentage > 40) return '#ef4444';
    if (percentage > 25) return '#f59e0b';
    return '#22c55e';
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
        Spending Pattern Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Accordion
            disableGutters
            sx={{
              backgroundColor: '#1c1917',
              color: '#f2f2f2',
              borderRadius: '15px !important',
              border: '1px solid #292524',
              boxShadow: 'none',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f2f2f2' }} />}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e' }}>
                  Category Breakdown
                </Typography>
                <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                  This view shows the stable shape of the cycle rather than re-explaining what already changed.
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(patterns.categoryBreakdown)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([category, data]) => (
                  <Box key={category} sx={{ marginBottom: 2 }}>
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
                      <Typography variant="h6">{category}</Typography>
                      <Chip
                        label={`₹${data.amount.toLocaleString()} (${data.percentage.toFixed(1)}%)`}
                        size="medium"
                        sx={{
                          backgroundColor: getProgressColor(data.percentage),
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={data.percentage}
                      sx={{
                        backgroundColor: '#374151',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(data.percentage),
                        },
                      }}
                    />
                    <Typography variant="h6" color="#a3a3a3">
                      {data.count} transactions
                    </Typography>
                  </Box>
                ))}
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12} md={5}>
          <Accordion
            disableGutters
            sx={{
              backgroundColor: '#1c1917',
              color: '#f2f2f2',
              borderRadius: '15px !important',
              border: '1px solid #292524',
              boxShadow: 'none',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f2f2f2' }} />}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e' }}>
                  Budget Category Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                  Secondary structural view by needs, wants, and other salary buckets.
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(patterns.salaryCategories)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .map(([category, data]) => {
                  const percentage = patterns.totalExpenses > 0 ? (data.amount / patterns.totalExpenses) * 100 : 0;
                  return (
                    <Box key={category} sx={{ marginBottom: 2 }}>
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
                        <Typography variant="h6">{category}</Typography>
                        <Chip
                          label={`₹${data.amount.toLocaleString()} (${percentage.toFixed(1)}%)`}
                          size="medium"
                          sx={{ backgroundColor: '#3b82f6', color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(percentage, 100)}
                        sx={{
                          backgroundColor: '#374151',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#3b82f6',
                          },
                        }}
                      />
                      <Typography variant="h6" color="#a3a3a3">
                        {data.count} transactions
                      </Typography>
                    </Box>
                  );
                })}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SpendingPatterns;
