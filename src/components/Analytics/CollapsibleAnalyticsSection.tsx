import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { DisclosureSummaryItem } from '../../utils/dashboardDisclosure';

interface CollapsibleAnalyticsSectionProps {
  storageKey: string;
  title: string;
  summaryItems: DisclosureSummaryItem[];
  children: React.ReactNode;
}

const CollapsibleAnalyticsSection: React.FC<CollapsibleAnalyticsSectionProps> = ({
  storageKey,
  title,
  summaryItems,
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (stored === null) {
      setExpanded(false);
    } else {
      setExpanded(stored === 'true');
    }
    setHydrated(true);
  }, [isMobile, storageKey]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !hydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, String(expanded));
  }, [expanded, hydrated, storageKey]);

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
      disableGutters
      sx={{
        backgroundColor: '#1c1917',
        color: '#f2f2f2',
        borderRadius: '18px !important',
        border: '1px solid #292524',
        boxShadow: 'none',
        overflow: 'hidden',
        '&::before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#f2f2f2' }} />}
        sx={{
          paddingX: 2,
          paddingY: 1,
          minHeight: '76px !important',
          '& .MuiAccordionSummary-content': {
            margin: '0 !important',
          },
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" fontWeight={700} sx={{ marginBottom: 1 }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {summaryItems.map((item) => (
              <Chip
                key={`${title}-${item.label}`}
                label={`${item.label}: ${item.value}`}
                size="small"
                sx={{
                  backgroundColor: isMobile ? '#0c0a09' : '#18181b',
                  color: '#d4d4d8',
                  border: '1px solid #3f3f46',
                }}
              />
            ))}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CollapsibleAnalyticsSection;
