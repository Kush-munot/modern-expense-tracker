
import React from 'react';
import { Box, Typography, Card as MuiCard, CardContent as MuiCardContent, SxProps, Theme } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { cardIcon } from './styles';

export type CardProps = {
  label: string;
  icon: SvgIconComponent; // Accepts Material UI icons
  amount: string;
  description: string;
  sx?: SxProps<Theme>; // Optional prop for additional styling
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Card({ label, icon: Icon, amount, description, sx }: CardProps) {
  return (
    <MuiCard sx={{ borderRadius: 2, boxShadow: 3, backgroundColor:"#1c1917",color:"#fafafa", ...sx }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Label */}
          <Typography variant="h6">{label}</Typography>
          {/* Icon */}
          <Icon fontSize="small" sx={cardIcon}/>
        </Box>
        <Box>
          {/* Amount */}
          <Typography variant="h4" fontWeight="bold">
            {amount}
          </Typography>
          {/* Description */}
          <Typography variant="caption">
            {description}
          </Typography>
        </Box>
      </CardContent>
    </MuiCard>
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement> & { sx?: SxProps<Theme> }) {
  return (
    <MuiCardContent
      {...props}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
        ...props.sx,
      }}
    />
  );
}
