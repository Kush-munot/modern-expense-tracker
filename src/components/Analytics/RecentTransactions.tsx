import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TransactionData } from '../../types/transaction';

interface RecentTransactionsProps {
  transactions: TransactionData[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const displayTransactions = React.useMemo(() => {
    return transactions.slice().reverse(); // Most recent first
  }, [transactions]);

  const cardStyle = {
    backgroundColor: "#1c1917",
    color: "#f2f2f2",
    borderRadius: '15px',
    height: '500px',
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
      day: 'numeric',
      year: 'numeric'
    });
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
        Recent Transactions
      </Typography>

      {/* Transaction List */}
      <Card sx={cardStyle}>
        <CardContent>
          {displayTransactions.length > 0 ? (
            displayTransactions.map((transaction, index) => {
              const isIncome = transaction["Expense/Income"] === "Income";
              const amount = isIncome ? transaction.Amount : transaction.Effective;
              
              return (
                <Box 
                  key={index} 
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2,
                    marginBottom: 1,
                    backgroundColor: '#2a2a2a', // Distinct background color for each transaction
                    borderLeft: `4px solid ${isIncome ? '#22c55e' : '#ef4444'}`, // Green/red border indicator
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#374151',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  {/* Left Section - Transaction Details */}
                  <Box sx={{ flex: 1 }}>
                    {/* Message/Description */}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      sx={{ 
                        color: '#f2f2f2',
                        marginBottom: 0.5
                      }}
                    >
                      {transaction.Message || `${transaction.Category} transaction`}
                    </Typography>
                    
                    {/* Category and Payment Method */}
                    <Box sx={{ display: 'flex', gap: 1, marginBottom: 0.5, flexWrap: 'wrap' }}>
                      <Typography 
                        variant="caption"
                        sx={{
                          backgroundColor: isIncome ? '#22c55e' : '#ef4444',
                          color: '#000',
                          padding: '2px 8px',
                          borderRadius: 1,
                          fontWeight: 'bold',
                          fontSize: '0.75rem'
                        }}
                      >
                        {transaction.Category}
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{
                          backgroundColor: '#374151',
                          color: '#f2f2f2',
                          padding: '2px 8px',
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        {transaction.ModeOfPayment}
                      </Typography>
                      {transaction.SalaryBifercationCat && (
                        <Typography 
                          variant="caption"
                          sx={{
                            backgroundColor: '#1e40af',
                            color: '#f2f2f2',
                            padding: '2px 8px',
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          {transaction.SalaryBifercationCat}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Right Section - Amount */}
                  <Box sx={{ textAlign: 'right', minWidth: '120px' }}>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      sx={{ 
                        color: isIncome ? '#22c55e' : '#ef4444',
                        marginBottom: 0.5
                      }}
                    >
                      {isIncome ? '+' : '-'}₹{amount.toLocaleString()}
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: '#a3a3a3',
                        display: 'block'
                      }}
                    >
                      {formatDate(transaction.Date)}
                    </Typography>
                    {!isIncome && Number(transaction.Minus) > 0 && (
                      <Typography 
                        variant="caption"
                        sx={{ 
                          color: '#fbbf24',
                          display: 'block',
                          fontSize: '0.7rem'
                        }}
                      >
                        Split: ₹{transaction.Minus}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              padding: 4,
              color: '#a3a3a3'
            }}>
              <Typography variant="h6">No transactions match the selected filters</Typography>
              <Typography variant="body1">Try adjusting your filter criteria</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecentTransactions;