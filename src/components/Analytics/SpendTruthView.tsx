import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TransactionData } from '../../types/transaction';
import { SpendTruthLane, summarizeSpendTruth } from '../../utils/spendTruth';

interface SpendTruthViewProps {
  transactions: TransactionData[];
}

const STORAGE_KEY = 'spend-truth-category-overrides-v1';

const laneLabels: Record<SpendTruthLane, string> = {
  fixed: 'Fixed Commitments',
  'flexible-essential': 'Flexible Essentials',
  discretionary: 'Discretionary',
  investments: 'Investments',
};

const laneColors: Record<SpendTruthLane, string> = {
  fixed: '#ef4444',
  'flexible-essential': '#f59e0b',
  discretionary: '#3b82f6',
  investments: '#22c55e',
};

const SpendTruthView: React.FC<SpendTruthViewProps> = ({ transactions }) => {
  const [categoryOverrides, setCategoryOverrides] = React.useState<Partial<Record<string, SpendTruthLane>>>({});

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return;
    }

    try {
      setCategoryOverrides(JSON.parse(storedValue));
    } catch {
      setCategoryOverrides({});
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categoryOverrides));
  }, [categoryOverrides]);

  const summary = React.useMemo(
    () => summarizeSpendTruth(transactions, { includeInvestments: false, categoryOverrides }),
    [transactions, categoryOverrides]
  );

  const cardStyle = {
    backgroundColor: '#1c1917',
    color: '#f2f2f2',
    borderRadius: '15px',
    height: '100%',
  };

  const categoryOptions = Array.from(
    new Set(
      transactions
        .filter((transaction) => transaction['Expense/Income'] === 'Expense')
        .map((transaction) => transaction.Category)
    )
  ).sort();

  const lanesToRender: SpendTruthLane[] = ['fixed', 'flexible-essential', 'discretionary'];

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
        Essential vs Optional Spend Truth
      </Typography>

      <Card sx={cardStyle}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, marginBottom: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#a3a3a3' }}>
                Visible Total
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ₹{summary.visibleTotal.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {lanesToRender.map((lane) => (
              <Grid item xs={12} md={4} key={lane}>
                <Card sx={{ ...cardStyle, backgroundColor: '#0c0a09', border: `1px solid ${laneColors[lane]}` }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: laneColors[lane], marginBottom: 1 }}>
                      {laneLabels[lane]}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 0.5 }}>
                      ₹{summary.lanes[lane].amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#a3a3a3', marginBottom: 2 }}>
                      {summary.lanes[lane].percentage.toFixed(1)}% of visible spend
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {summary.lanes[lane].categories.length > 0 ? (
                        summary.lanes[lane].categories.map((item) => (
                          <Box
                            key={`${lane}-${item.category}`}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Chip label={item.category} sx={{ backgroundColor: '#18181b', color: '#f2f2f2' }} />
                              <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                                ₹{item.amount.toLocaleString()} ({item.percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: '#71717a' }}>
                          No spend in this lane for the current cycle.
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Accordion
            disableGutters
            sx={{
              marginTop: 3,
              backgroundColor: '#0c0a09',
              color: '#f2f2f2',
              border: '1px solid #292524',
              borderRadius: '18px !important',
              boxShadow: 'none',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f2f2f2' }} />}>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#22c55e' }}>
                  Edit classifications
                </Typography>
                <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                  Only open this when you want to re-map categories between fixed, essential, discretionary, and investments.
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {categoryOptions.map((category) => (
                  <Grid item xs={12} sm={6} md={4} key={`override-${category}`}>
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: '#f2f2f2' }}>{category}</InputLabel>
                      <Select
                        value={categoryOverrides[category] ?? ''}
                        label={category}
                        onChange={(event) => {
                          const value = event.target.value as SpendTruthLane | '';
                          setCategoryOverrides((current) => {
                            const next = { ...current };
                            if (!value) {
                              delete next[category];
                            } else {
                              next[category] = value;
                            }
                            return next;
                          });
                        }}
                        sx={{
                          color: '#f2f2f2',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#3f3f46' },
                          '& .MuiSvgIcon-root': { color: '#f2f2f2' },
                        }}
                      >
                        <MenuItem value="">Use default</MenuItem>
                        {lanesToRender.map((lane) => (
                          <MenuItem key={`${category}-${lane}`} value={lane}>
                            {laneLabels[lane]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SpendTruthView;
