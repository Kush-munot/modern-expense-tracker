import React from 'react';
import { Box, Typography } from '@mui/material';

type UserCardProps = {
    name: string;
    email: string;
    saleAmount: string;
};


const Transaction = (props: UserCardProps) => {
    return (
        <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={3} sx={{backgroundColor:"#0c0a09", margin:'1rem 0', color:'#f2f2f2', padding:'0.5rem', borderRadius:'15px'}}>
            <Box>
                <Typography variant="h6" fontWeight="bold">
                    {props.name}
                </Typography>
                <Typography
                    variant="body2" 
                    noWrap
                    sx={{ maxWidth: { xs: 120, sm: 'auto' }, color:"#22c55e", fontWeight:'700' }}
                >
                    {props.email}
                </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{color:'#f2f2f2'}}>
                {props.saleAmount}
            </Typography>
        </Box>
    );
}

export default Transaction;