import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { 
  LightbulbOutlined, 
  TrendingDown, 
  AccountBalance, 
  Timeline,
  Warning,
  CheckCircle,
  TrendingUp
} from '@mui/icons-material';
import { TransactionData, BASE_MONTHLY_INCOME } from '../../types/transaction';

interface BudgetRecommendationsProps {
  transactions: TransactionData[];
}

const BudgetRecommendations: React.FC<BudgetRecommendationsProps> = ({ transactions }) => {
  const recommendations = React.useMemo(() => {
    // Base expected monthly income (shared constant)
    
    const expenses = transactions.filter(t => t["Expense/Income"] === "Expense");
    const incomeTransactions = transactions.filter(t => t["Expense/Income"] === "Income");
    
    // Calculate total income = Base Income + Additional Income
    const additionalIncome = incomeTransactions.reduce((sum, t) => sum + t.Amount, 0);
    const totalIncome = BASE_MONTHLY_INCOME + additionalIncome;
    const totalExpenses = expenses.reduce((sum, t) => sum + t.Effective, 0);
    
    // 50/30/20 Rule Analysis based on total income (base + additional)
    const needsExpenses = expenses.filter(t => t.SalaryBifercationCat === "Needs").reduce((sum, t) => sum + t.Effective, 0);
    const wantsExpenses = expenses.filter(t => t.SalaryBifercationCat === "Wants").reduce((sum, t) => sum + t.Effective, 0);
    
    const needsPercentage = totalIncome > 0 ? (needsExpenses / totalIncome) * 100 : 0;
    const wantsPercentage = totalIncome > 0 ? (wantsExpenses / totalIncome) * 100 : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    
    const recommendations = [];
    
    // 50/30/20 Rule recommendations
    if (needsPercentage > 50) {
      recommendations.push({
        type: 'warning',
        category: 'Needs Budget',
        title: 'Reduce Essential Expenses',
        message: `Your needs spending is ${needsPercentage.toFixed(1)}% (recommended: 50%)`,
        suggestion: 'Look for ways to reduce utility bills, transportation costs, or find cheaper alternatives for necessities',
        priority: 'high'
      });
    }
    
    if (wantsPercentage > 30) {
      recommendations.push({
        type: 'warning',
        category: 'Wants Budget',
        title: 'Cut Back on Discretionary Spending',
        message: `Your wants spending is ${wantsPercentage.toFixed(1)}% (recommended: 30%)`,
        suggestion: 'Consider reducing entertainment, dining out, and non-essential shopping',
        priority: 'medium'
      });
    }
    
    if (savingsRate < 20 && savingsRate >= 0) {
      recommendations.push({
        type: 'info',
        category: 'Savings',
        title: 'Increase Your Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}% (recommended: 20%)`,
        suggestion: 'Try to increase income or reduce expenses to reach the 20% savings goal',
        priority: 'high'
      });
    } else if (savingsRate < 0) {
      recommendations.push({
        type: 'error',
        category: 'Savings',
        title: 'You are overspending!',
        message: `You are spending ${Math.abs(savingsRate).toFixed(1)}% more than your income`,
        suggestion: 'Immediately review and cut unnecessary expenses. Consider increasing income sources',
        priority: 'critical'
      });
    }
    
    // Category-specific recommendations
    const categoryExpenses = expenses.reduce((acc, t) => {
      acc[t.Category] = (acc[t.Category] || 0) + t.Effective;
      return acc;
    }, {} as Record<string, number>);
    
    // Food & Beverages check
    const foodExpenses = categoryExpenses["Food & Beverages"] || 0;
    const foodPercentage = totalIncome > 0 ? (foodExpenses / totalIncome) * 100 : 0;
    if (foodPercentage > 15) {
      recommendations.push({
        type: 'info',
        category: 'Food & Beverages',
        title: 'High Food Spending',
        message: `Food expenses are ${foodPercentage.toFixed(1)}% of income`,
        suggestion: 'Consider meal planning, cooking at home more often, and reducing dining out',
        priority: 'medium'
      });
    }
    
    // Shopping check
    const shoppingExpenses = categoryExpenses["Shopping"] || 0;
    const shoppingPercentage = totalIncome > 0 ? (shoppingExpenses / totalIncome) * 100 : 0;
    if (shoppingPercentage > 10) {
      recommendations.push({
        type: 'info',
        category: 'Shopping',
        title: 'Review Shopping Habits',
        message: `Shopping expenses are ${shoppingPercentage.toFixed(1)}% of income`,
        suggestion: 'Create a shopping list, wait 24 hours before non-essential purchases, and look for deals',
        priority: 'low'
      });
    }
    
    // Positive recommendations
    if (savingsRate >= 20) {
      recommendations.push({
        type: 'success',
        category: 'Savings',
        title: 'Great Savings Rate!',
        message: `Your savings rate of ${savingsRate.toFixed(1)}% exceeds the recommended 20%`,
        suggestion: 'Consider investing your surplus savings for long-term growth',
        priority: 'low'
      });
    }
    
    if (needsPercentage <= 50 && wantsPercentage <= 30) {
      recommendations.push({
        type: 'success',
        category: 'Budget Balance',
        title: 'Well-Balanced Budget',
        message: 'Your spending follows the 50/30/20 rule effectively',
        suggestion: 'Maintain this healthy spending pattern and continue monitoring your expenses',
        priority: 'low'
      });
    }
    
    // Additional insights and warnings
    const warnings = [];
    const insights = [];
    
    // Check for high "Wants" spending
    const wantsSpending = expenses.filter(t => t.SalaryBifercationCat === "Wants").reduce((sum, t) => sum + t.Effective, 0);
    const wantsSpendingPercentage = (wantsSpending / totalExpenses) * 100;
    if (wantsSpendingPercentage > 30) {
      warnings.push({
        type: 'warning',
        message: `High "Wants" spending: ${wantsSpendingPercentage.toFixed(1)}% of total expenses`,
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
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      }),
      budgetBreakdown: {
        needsPercentage,
        wantsPercentage,
        savingsRate,
        totalIncome,
        baseIncome: BASE_MONTHLY_INCOME,
        additionalIncome,
        totalExpenses,
        hasAdditionalIncome: additionalIncome > 0
      },
      warnings,
      insights
    };
  }, [transactions]);

  const cardStyle = {
    backgroundColor: "#1c1917",
    color: "#f2f2f2",
    borderRadius: '15px'
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'error': return <Warning sx={{ color: '#ef4444' }} />;
      case 'warning': return <TrendingDown sx={{ color: '#f59e0b' }} />;
      case 'info': return <LightbulbOutlined sx={{ color: '#3b82f6' }} />;
      case 'success': return <Timeline sx={{ color: '#22c55e' }} />;
      default: return <AccountBalance sx={{ color: '#6b7280' }} />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'error': return '#7f1d1d';
      case 'warning': return '#78350f';
      case 'info': return '#1e3a8a';
      case 'success': return '#166534';
      default: return '#374151';
    }
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
        Smart Budget Recommendations
      </Typography>

      <Grid container spacing={3}>
        {/* All Recommendations Combined */}
        <Grid item xs={12}>
          <Card sx={cardStyle}>
            <CardContent>


              {/* Personalized Recommendations */}
              {recommendations.recommendations.length > 0 && (
                <Box sx={{ marginBottom: recommendations.warnings.length > 0 || recommendations.insights.length > 0 ? 3 : 0 }}>
                  {recommendations.recommendations.map((rec, index) => (
                    <Box key={`rec-${index}`}>
                      <Box sx={{ 
                        padding: 2,
                        backgroundColor: getRecommendationColor(rec.type),
                        borderRadius: 1,
                        marginBottom: 2
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: 1 }}>
                          {getRecommendationIcon(rec.type)}
                          <Box sx={{ marginLeft: 1, flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {rec.title}
                              </Typography>
                              <Chip 
                                label={rec.category}
                                size="medium"
                                sx={{ backgroundColor: '#374151', color: '#f3f4f6', fontSize: '1rem' }}
                              />
                            </Box>
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                              {rec.message}
                            </Typography>
                            <Typography variant="body1" sx={{ 
                              color: rec.type === 'success' ? '#86efac' : '#d1d5db',
                              fontStyle: 'italic'
                            }}>
                              💡 {rec.suggestion}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              
              {/* Warnings */}
              {recommendations.warnings.length > 0 && (
                <Box sx={{ marginBottom: recommendations.insights.length > 0 ? 2 : 0 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#ef4444', marginBottom: 1 }}>
                    ⚠️ Warnings:
                  </Typography>
                  {recommendations.warnings.map((warning, index) => (
                    <Box key={`warning-${index}`} sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      marginBottom: 1,
                      padding: 2,
                      backgroundColor: '#7f1d1d',
                      borderRadius: 1
                    }}>
                      <Warning sx={{ color: '#ef4444', marginRight: 1, fontSize: '1.2rem' }} />
                      <Box>
                        <Typography variant="h6">{warning.message}</Typography>
                        <Typography variant="body1" sx={{ 
                          color: '#fca5a5',
                          fontStyle: 'italic'
                        }}>
                          💡 {warning.suggestion}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Insights */}
              {recommendations.insights.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#3b82f6', marginBottom: 1 }}>
                    💡 Insights:
                  </Typography>
                  {recommendations.insights.map((insight, index) => (
                    <Box key={`insight-${index}`} sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      marginBottom: 1,
                      padding: 2,
                      backgroundColor: '#1e3a8a',
                      borderRadius: 1
                    }}>
                      <TrendingUp sx={{ color: '#3b82f6', marginRight: 1, fontSize: '1.2rem' }} />
                      <Box>
                        <Typography variant="h6">{insight.message}</Typography>
                        <Typography variant="body1" sx={{ 
                          color: '#93c5fd',
                          fontStyle: 'italic'
                        }}>
                          💡 {insight.suggestion}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* No recommendations message */}
              {recommendations.recommendations.length === 0 && recommendations.warnings.length === 0 && recommendations.insights.length === 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: 4,
                  backgroundColor: '#166534',
                  borderRadius: 1
                }}>
                  <CheckCircle sx={{ color: '#22c55e', marginRight: 1 }} />
                  <Typography variant="h6">🎉 Perfect Financial Health! Your spending patterns are optimal. Keep up the great work!</Typography>
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