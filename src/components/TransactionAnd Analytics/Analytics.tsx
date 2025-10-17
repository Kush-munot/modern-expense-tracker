/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material'
import React from 'react'
import AnalyticsSummary from '../Analytics/AnalyticsSummary'
import SpendingPatterns from '../Analytics/SpendingPatterns'
import BudgetRecommendations from '../Analytics/BudgetRecommendations'
import QuickStats from '../Analytics/QuickStats'

const TransactionAndAnalytics = (props: any) => {
    return (
        <Box>
            {/* Enhanced Analytics Dashboard */}
            <AnalyticsSummary transactions={props.allTransactions} />

            {/* Quick Transaction Stats */}
            <QuickStats transactions={props.allTransactions} />
            
            
            {/* Spending Patterns Analysis */}
            <SpendingPatterns transactions={props.allTransactions} />
            
            {/* Budget Recommendations */}
            <BudgetRecommendations transactions={props.allTransactions} />
        </Box>
    )
}

export default TransactionAndAnalytics