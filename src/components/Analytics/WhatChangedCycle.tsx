import React from 'react';
import { Alert, Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import type { TransactionData } from '../../types/transaction';
import { analyzeCycleChanges } from '../../utils/cycleAnalysis';

interface WhatChangedCycleProps {
  transactions: TransactionData[];
}

function formatCycleLabel(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const WhatChangedCycle: React.FC<WhatChangedCycleProps> = ({ transactions }) => {
  const analysis = React.useMemo(() => analyzeCycleChanges(transactions), [transactions]);

  const cardStyle = {
    backgroundColor: '#1c1917',
    color: '#f2f2f2',
    borderRadius: '15px',
    height: '100%',
  };

  const hasComparisonData =
    analysis.currentTransactions.length > 0 || analysis.previousTransactions.length > 0;

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
        What Changed This Cycle
      </Typography>

      <Card sx={cardStyle}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 2 }}>
            <Chip
              label={`Current: ${formatCycleLabel(analysis.currentCycle.start)} to ${formatCycleLabel(analysis.currentCycle.end)}`}
              sx={{ backgroundColor: '#166534', color: '#f2f2f2' }}
            />
            <Chip
              label={`Previous: ${formatCycleLabel(analysis.previousCycle.start)} to ${formatCycleLabel(analysis.previousCycle.end)}`}
              sx={{ backgroundColor: '#1f2937', color: '#f2f2f2' }}
            />
          </Box>

          {!hasComparisonData ? (
            <Alert severity="info" sx={{ backgroundColor: '#1f2937', color: '#f2f2f2' }}>
              Not enough cycle data yet to explain what changed.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e', marginBottom: 1.5 }}>
                  Biggest Increases
                </Typography>
                {analysis.topIncreases.length > 0 ? (
                  analysis.topIncreases.map((item) => (
                    <Box key={`increase-${item.category}`} sx={{ marginBottom: 1.5 }}>
                      <Typography variant="h6">{item.category}</Typography>
                      <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                        Up by ₹{item.delta.toLocaleString()} from ₹{item.previousAmount.toLocaleString()} to ₹{item.currentAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    No major increases this cycle.
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#ef4444', marginBottom: 1.5 }}>
                  Biggest Decreases
                </Typography>
                {analysis.topDecreases.length > 0 ? (
                  analysis.topDecreases.map((item) => (
                    <Box key={`decrease-${item.category}`} sx={{ marginBottom: 1.5 }}>
                      <Typography variant="h6">{item.category}</Typography>
                      <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                        Down by ₹{Math.abs(item.delta).toLocaleString()} from ₹{item.previousAmount.toLocaleString()} to ₹{item.currentAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    No major decreases this cycle.
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#3b82f6', marginBottom: 1.5 }}>
                  New Or Missing Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 1 }}>
                  {analysis.newCategories.map((category) => (
                    <Chip key={`new-${category}`} label={`New: ${category}`} sx={{ backgroundColor: '#1d4ed8', color: '#fff' }} />
                  ))}
                  {analysis.missingCategories.map((category) => (
                    <Chip key={`missing-${category}`} label={`Missing: ${category}`} sx={{ backgroundColor: '#7f1d1d', color: '#fff' }} />
                  ))}
                </Box>
                {analysis.newCategories.length === 0 && analysis.missingCategories.length === 0 && (
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    Category mix stayed mostly stable across the two cycles.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WhatChangedCycle;
