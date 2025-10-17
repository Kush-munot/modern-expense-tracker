import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import Transaction from '../TransactionAnd Analytics/Transaction';
import { TransactionData } from '../../types/transaction';

interface QuickStatsProps {
  transactions: TransactionData[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ transactions }) => {
  const stats = React.useMemo(() => {
    const expenses = transactions.filter(t => t["Expense/Income"] === "Expense");
    const income = transactions.filter(t => t["Expense/Income"] === "Income");
    
    // Top 3 largest expenses
    const topExpenses = expenses
      .sort((a, b) => b.Effective - a.Effective)
      .slice(0, 3);
    
    // Top 3 recent income transactions
    const recentIncome = income
      .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
      .slice(0, 3);
    
    // Most frequent categories
    const categoryFreq = expenses.reduce((acc, t) => {
      acc[t.Category] = (acc[t.Category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategories = Object.entries(categoryFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      topExpenses,
      recentIncome,
      topCategories
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: "#1c1917",
    color: "#f2f2f2",
    borderRadius: '15px',
    height: '400px',
    overflowY: 'scroll',
    "&::-webkit-scrollbar": {
      display: "none"
    },
    scrollbarWidth: "none",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTransactionForComponent = (transaction: TransactionData) => {
    const displayMessage = transaction.Message || `${transaction.Category} transaction`;
    const displayPayment = `${transaction.ModeOfPayment} • ${formatDate(transaction.Date)}`;
    const displayAmount = transaction["Expense/Income"] === "Income" 
      ? `+₹${transaction.Amount}` 
      : `-₹${transaction.Effective}`;

    return {
      name: displayMessage,
      email: displayPayment,
      saleAmount: displayAmount
    };
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
        ⚡ Quick Transaction Stats
      </Typography>

      <Grid container spacing={3}>
        {/* Top Expenses */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#ef4444', marginBottom: 2 }}>
                Largest Expenses
              </Typography>
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none"
              }}>
                {stats.topExpenses.length > 0 ? (
                  stats.topExpenses.map((transaction, index) => {
                    const transactionProps = formatTransactionForComponent(transaction);
                    return (
                      <Box key={index} sx={{ marginBottom: 1 }}>
                        <Transaction
                          name={transactionProps.name}
                          email={transactionProps.email}
                          saleAmount={transactionProps.saleAmount}
                        />
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="h6" color="#a3a3a3">No expenses found</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Income */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 2 }}>
                Recent Income
              </Typography>
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none"
              }}>
                {stats.recentIncome.length > 0 ? (
                  stats.recentIncome.map((transaction, index) => {
                    const transactionProps = formatTransactionForComponent(transaction);
                    return (
                      <Box key={index} sx={{ marginBottom: 1 }}>
                        <Transaction
                          name={transactionProps.name}
                          email={transactionProps.email}
                          saleAmount={transactionProps.saleAmount}
                        />
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="h6" color="#a3a3a3">No income found</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} md={4}>
          <Card sx={cardStyle}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#3b82f6', marginBottom: 2 }}>
                Most Active Categories
              </Typography>
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none"
              }}>
                {stats.topCategories.length > 0 ? (
                  stats.topCategories.map(([category, count], index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: "#0c0a09", 
                      margin: '1rem 0', 
                      padding: '0.5rem', 
                      borderRadius: '15px'
                    }}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">{category}</Typography>
                        <Typography variant="body2" sx={{ color: "#22c55e", fontWeight: '700' }}>
                          {count} transactions
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#f2f2f2' }}>
                        #{index + 1}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="h6" color="#a3a3a3">No categories found</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickStats;