import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip, Grid } from '@mui/material';
import { TransactionData } from '../../types/transaction';

interface SpendingPatternsProps {
  transactions: TransactionData[];
}

const SpendingPatterns: React.FC<SpendingPatternsProps> = ({ transactions }) => {
  const patterns = React.useMemo(() => {
    const expenses = transactions.filter(t => t["Expense/Income"] === "Expense");
    const totalExpenses = expenses.reduce((sum, t) => sum + t.Effective, 0);
    
    // Category breakdown with percentages
    const categoryBreakdown = expenses.reduce((acc, t) => {
      if (!acc[t.Category]) {
        acc[t.Category] = { amount: 0, count: 0, percentage: 0 };
      }
      acc[t.Category].amount += t.Effective;
      acc[t.Category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number; percentage: number }>);

    // Calculate percentages
    Object.keys(categoryBreakdown).forEach(category => {
      categoryBreakdown[category].percentage = (categoryBreakdown[category].amount / totalExpenses) * 100;
    });

    // Salary bifurcation analysis
    const salaryCategories = expenses.reduce((acc, t) => {
      if (!acc[t.SalaryBifercationCat]) {
        acc[t.SalaryBifercationCat] = { amount: 0, count: 0 };
      }
      acc[t.SalaryBifercationCat].amount += t.Effective;
      acc[t.SalaryBifercationCat].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    // Identify spending patterns and warnings
    const warnings = [];
    const insights = [];

    // Check for high "Wants" spending
    const wantsSpending = salaryCategories["Wants"]?.amount || 0;
    const wantsPercentage = (wantsSpending / totalExpenses) * 100;
    if (wantsPercentage > 30) {
      warnings.push({
        type: 'warning',
        message: `High "Wants" spending: ${wantsPercentage.toFixed(1)}% of total expenses`,
        suggestion: 'Consider reducing discretionary spending'
      });
    }

    // Check for frequent small transactions
    const smallTransactions = expenses.filter(t => t.Effective < 100).length;
    if (smallTransactions > expenses.length * 0.6) {
      insights.push({
        type: 'info',
        message: `${smallTransactions} small transactions (< ₹100)`,
        suggestion: 'Consider bundling small purchases to reduce transaction frequency'
      });
    }

    // Check cash vs digital spending
    const cashSpending = expenses.filter(t => t.ModeOfPayment === "Cash").reduce((sum, t) => sum + t.Effective, 0);
    const cashPercentage = (cashSpending / totalExpenses) * 100;
    if (cashPercentage > 70) {
      insights.push({
        type: 'info',
        message: `${cashPercentage.toFixed(1)}% of spending is in cash`,
        suggestion: 'Consider using digital payments for better tracking and rewards'
      });
    }

    return {
      categoryBreakdown,
      salaryCategories,
      warnings,
      insights,
      totalExpenses
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: "#1c1917",
    color: "#f2f2f2",
    borderRadius: '15px',
    marginBottom: 2
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 40) return '#ef4444';
    if (percentage > 25) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ 
        color: '#22c55e', 
        marginBottom: 3, 
        fontWeight: 'bold',
        fontSize: '22px',
        "@media (max-width:540px)": {
          fontSize: '1.3rem'
        }
      }}>
        Spending Pattern Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                Category Breakdown
              </Typography>
              {Object.entries(patterns.categoryBreakdown)
                .sort(([,a], [,b]) => b.amount - a.amount)
                .map(([category, data]) => (
                  <Box key={category} sx={{ marginBottom: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                      <Typography variant="h6">{category}</Typography>
                      <Chip 
                        label={`₹${data.amount.toLocaleString()} (${data.percentage.toFixed(1)}%)`}
                        size="medium"
                        sx={{ backgroundColor: getProgressColor(data.percentage), color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.percentage} 
                      sx={{ 
                        backgroundColor: '#374151',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(data.percentage)
                        }
                      }}
                    />
                    <Typography variant="h6" color="#a3a3a3">
                      {data.count} transactions
                    </Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Budget Categories (Salary Bifurcation) */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                Budget Category Analysis
              </Typography>
              {Object.entries(patterns.salaryCategories)
                .sort(([,a], [,b]) => b.amount - a.amount)
                .map(([category, data]) => {
                  const percentage = (data.amount / patterns.totalExpenses) * 100;
                  return (
                    <Box key={category} sx={{ marginBottom: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
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
                            backgroundColor: '#3b82f6'
                          }
                        }}
                      />
                      <Typography variant="h6" color="#a3a3a3">
                        {data.count} transactions
                      </Typography>
                    </Box>
                  );
                })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SpendingPatterns;