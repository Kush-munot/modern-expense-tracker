/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import AnalyticsSummary from '../Analytics/AnalyticsSummary'
import RecentTransactions from '../Analytics/RecentTransactions'
import WhatChangedCycle from '../Analytics/WhatChangedCycle'
import SpendTruthView from '../Analytics/SpendTruthView'
import SpendingPatterns from '../Analytics/SpendingPatterns'
import BudgetRecommendations from '../Analytics/BudgetRecommendations'
import QuickStats from '../Analytics/QuickStats'
import CollapsibleAnalyticsSection from '../Analytics/CollapsibleAnalyticsSection'
import { getCycleBounds, getTransactionsForCycle } from '../../utils/cycleAnalysis'
import { summarizeBudgetRecommendations, summarizeQuickStats, summarizeSpendingPatterns } from '../../utils/dashboardDisclosure'

const LayerHeader = ({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) => (
    <Box sx={{ paddingX: 2, paddingTop: 2, paddingBottom: 0.5 }}>
        <Typography variant="overline" sx={{ letterSpacing: '0.18em', color: '#22c55e', fontWeight: 700 }}>
            {eyebrow}
        </Typography>
        <Typography
            variant="h5"
            sx={{
                color: '#f2f2f2',
                fontWeight: 700,
                marginTop: 0.25,
                fontSize: {
                    xs: '1.35rem',
                    md: '1.6rem',
                },
            }}
        >
            {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#a3a3a3', maxWidth: '720px', marginTop: 0.5 }}>
            {description}
        </Typography>
    </Box>
)

const TransactionAndAnalytics = (props: any) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const currentCycleTransactions = React.useMemo(() => {
        const currentCycle = getCycleBounds(new Date());
        return getTransactionsForCycle(props.allTransactions, currentCycle);
    }, [props.allTransactions]);
    const quickStatsSummary = React.useMemo(() => summarizeQuickStats(currentCycleTransactions), [currentCycleTransactions]);
    const spendingPatternsSummary = React.useMemo(() => summarizeSpendingPatterns(currentCycleTransactions), [currentCycleTransactions]);
    const budgetRecommendationsSummary = React.useMemo(() => summarizeBudgetRecommendations(currentCycleTransactions), [currentCycleTransactions]);

    return (
        <Box>
            <LayerHeader
                eyebrow="Now"
                title={isMobile ? 'Daily control surface' : 'Current cycle status'}
                description="Keep the top of the dashboard focused on where you stand right now and what you might need to log next."
            />
            <AnalyticsSummary transactions={currentCycleTransactions} />
            <RecentTransactions transactions={currentCycleTransactions} />

            <LayerHeader
                eyebrow="Attention"
                title="What deserves a closer look"
                description="These sections stay visible because they explain what changed and whether the current cycle is drifting in the wrong direction."
            />
            <WhatChangedCycle transactions={props.allTransactions} />
            <SpendTruthView transactions={currentCycleTransactions} />

            <LayerHeader
                eyebrow="Deep Dive"
                title={isMobile ? 'Expand for deeper review' : 'Detailed analytics'}
                description="These heavier sections stay collapsed by default so you can expand them only when you want a deeper review."
            />
            <Box sx={{ padding: 2, display: 'grid', gap: 2 }}>
                <CollapsibleAnalyticsSection
                    storageKey="analytics-section-quick-stats"
                    title="Quick Transaction Stats"
                    summaryItems={quickStatsSummary}
                >
                    <QuickStats transactions={currentCycleTransactions} />
                </CollapsibleAnalyticsSection>

                <CollapsibleAnalyticsSection
                    storageKey="analytics-section-spending-patterns"
                    title="Spending Pattern Analysis"
                    summaryItems={spendingPatternsSummary}
                >
                    <SpendingPatterns transactions={currentCycleTransactions} />
                </CollapsibleAnalyticsSection>

                <CollapsibleAnalyticsSection
                    storageKey="analytics-section-budget-recommendations"
                    title="Smart Budget Recommendations"
                    summaryItems={budgetRecommendationsSummary}
                >
                    <BudgetRecommendations transactions={currentCycleTransactions} />
                </CollapsibleAnalyticsSection>
            </Box>
        </Box>
    )
}

export default TransactionAndAnalytics
