import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, Assessment, CreditCard, CompareArrows, Toll } from '@mui/icons-material';
import CardComponent from '../CardComponent/CardComponent';
import { TransactionData, BASE_MONTHLY_INCOME } from '../../types/transaction';
import RecentTransactions from './RecentTransactions';

interface AnalyticsSummaryProps {
  transactions: TransactionData[];
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ transactions }) => {
  const analytics = React.useMemo(() => {
    // Base expected monthly income (shared constant)
    
    // Calculate running balance like in BalanceGrid component
    let totalExpenses = 0;
    let additionalIncome = 0;
    
    transactions.forEach((transaction) => {
      if (transaction["Expense/Income"] === "Income") {
        additionalIncome += transaction.Amount; // Track extra income (stocks, etc.)
      } else {
        totalExpenses += transaction.Effective;
      }
    });
    
    // Total Income = Base Income + Additional Income (stocks, side income, etc.)
    const totalIncome = BASE_MONTHLY_INCOME + additionalIncome;
    
    // Net Balance = Total Income - Total Expenses
    const netBalance = totalIncome - totalExpenses;
    
    // Savings Rate = (Net Balance / Total Income) × 100
    let savingsRate = 0;
    if (totalIncome > 0) {
      savingsRate = (netBalance / totalIncome) * 100;
    }
    
    // Category-wise expense analysis (only expenses, like original code)
    const categoryExpenses = transactions
      .filter(t => t["Expense/Income"] === "Expense")
      .reduce((acc, t) => {
        acc[t.Category] = (acc[t.Category] || 0) + t.Effective;
        return acc;
      }, {} as Record<string, number>);
    
    const topExpenseCategory = Object.entries(categoryExpenses)
      .sort(([,a], [,b]) => b - a)[0];
    
    // Payment method analysis (matching BalanceGrid logic - using Amount for expenses)
    const paymentMethods = transactions.reduce((acc, t) => {
      if (t["Expense/Income"] === "Expense") {
        acc[t.ModeOfPayment] = (acc[t.ModeOfPayment] || 0) + t.Amount;
      } else {
        acc[t.ModeOfPayment] = (acc[t.ModeOfPayment] || 0) + t.Amount;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const avgDailyExpense = totalExpenses / 30; // Approximate monthly to daily

    // 50/30/20 Rule Analysis based on total income (base + additional)
    const needsExpenses = transactions
      .filter(t => t["Expense/Income"] === "Expense" && t.SalaryBifercationCat === "Needs")
      .reduce((sum, t) => sum + t.Effective, 0);
    const wantsExpenses = transactions
      .filter(t => t["Expense/Income"] === "Expense" && t.SalaryBifercationCat === "Wants")
      .reduce((sum, t) => sum + t.Effective, 0);
    
    const needsPercentage = totalIncome > 0 ? (needsExpenses / totalIncome) * 100 : 0;
    const wantsPercentage = totalIncome > 0 ? (wantsExpenses / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      baseIncome: BASE_MONTHLY_INCOME,
      additionalIncome,
      totalExpenses,
      netBalance,
      categoryExpenses,
      topExpenseCategory,
      paymentMethods,
      avgDailyExpense,
      transactionCount: transactions.length,
      savingsRate,
      hasAdditionalIncome: additionalIncome > 0,
      // 50/30/20 Rule data
      needsExpenses,
      wantsExpenses,
      needsPercentage,
      wantsPercentage
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: "#1c1917",
    color: "#f2f2f2",
    borderRadius: '15px',
    height: '100%'
  };

  return (
    <Box sx={{ padding: 2 }}>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={cardStyle}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" color="#a3a3a3">
                    Total Income {analytics.hasAdditionalIncome ? `(₹${analytics.baseIncome.toLocaleString()} + ₹${analytics.additionalIncome.toLocaleString()})` : "(Base)"}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="#22c55e">₹{analytics.totalIncome.toLocaleString()}</Typography>
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
                  <Typography variant="h6" color="#a3a3a3">Total Expenses</Typography>
                  <Typography variant="h4" fontWeight="bold" color="#ef4444">₹{analytics.totalExpenses.toLocaleString()}</Typography>
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
                  <Typography variant="h6" color="#a3a3a3">Net Balance</Typography>
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
                  <Typography variant="h6" color="#a3a3a3">Savings Rate</Typography>
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

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <RecentTransactions transactions={transactions} />
        </Grid>

        {/* Payment Methods - Using existing card components */}
        <Grid item xs={12}>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <CardComponent
                label="Credit Card Expense"
                icon={CreditCard}
                amount={`₹${(analytics.paymentMethods['Credit Card'] || 0).toLocaleString()}`}
                description="Spent on recent purchases via Credit Card"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardComponent
                label="UPI Expenses"
                icon={CompareArrows}
                amount={`₹${(analytics.paymentMethods['UPI'] || 0).toLocaleString()}`}
                description="Spent on recent purchases via Debit Card or UPI"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardComponent
                label="Cash Expenses"
                icon={Toll}
                amount={`₹${(analytics.paymentMethods['Cash'] || 0).toLocaleString()}`}
                description="Spent on recent purchases via Cash"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Insights Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                Key Insights
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="h6" color="#a3a3a3">Top Expense Category:</Typography>
                  <Chip 
                    label={`${analytics.topExpenseCategory?.[0] || 'N/A'}: ₹${analytics.topExpenseCategory?.[1]?.toLocaleString() || 0}`}
                    sx={{ backgroundColor: '#ef4444', color: 'white', marginTop: 0.5, fontSize: '1rem' }}
                  />
                </Box>
                <Box>
                  <Typography variant="h6" color="#a3a3a3">Average Daily Expense:</Typography>
                  <Typography variant="h6" fontWeight="bold">₹{analytics.avgDailyExpense.toFixed(0)}</Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="#a3a3a3">Total Transactions:</Typography>
                  <Typography variant="h6" fontWeight="bold">{analytics.transactionCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 50/30/20 Rule Analysis */}
        <Grid item xs={12} md={6}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                50/30/20 Rule Analysis
              </Typography>
              
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6" color="#a3a3a3">Needs (Recommended: 50%)</Typography>
                <Typography variant="h4" fontWeight="bold" color={analytics.needsPercentage > 50 ? '#ef4444' : '#22c55e'}>
                  {analytics.needsPercentage.toFixed(1)}%
                </Typography>
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6" color="#a3a3a3">Wants (Recommended: 30%)</Typography>
                <Typography variant="h4" fontWeight="bold" color={analytics.wantsPercentage > 30 ? '#ef4444' : '#22c55e'}>
                  {analytics.wantsPercentage.toFixed(1)}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" color="#a3a3a3">Savings (Recommended: 20%)</Typography>
                <Typography variant="h4" fontWeight="bold" color={analytics.savingsRate < 20 ? '#ef4444' : '#22c55e'}>
                  {analytics.savingsRate.toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsSummary;