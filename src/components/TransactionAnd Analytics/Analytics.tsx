/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, Grid } from '@mui/material'
import React from 'react'
import Chart from '../BarChart/Chart'
import Transaction from './Transaction'
import { cardStyles1 } from '../BarChart/styles'

const TransactionAndAnalytics = (props: any) => {
    return (
        <div>
            <Grid container spacing={4}>
                {/* The Grid items will stack in one column on small screens and switch to two columns on larger screens */}
                <Grid item xs={12} lg={6}>
                    <Card sx={cardStyles1}>
                        <CardContent>
                            {(props.allTransactions).slice().reverse().map((d: any, index: number) => (
                                <Transaction
                                    key={index}
                                    name={d.Message}
                                    email={d.ModeOfPayment}
                                    saleAmount={d.Amount}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Chart allTransactions={props.allTransactions} />
                </Grid>
            </Grid>
        </div>
    )
}

export default TransactionAndAnalytics