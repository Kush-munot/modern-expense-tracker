/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'
import { PieChart, Pie, Cell, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Rectangle } from "recharts";
import { balanceStyle, cardStyles } from './styles';


const COLORS = [
    "#33FF57", // Vivid Lime Green
    "#3357FF", // Vivid Blue
    "#FF33A1", // Vivid Pink
    "#FFC300", // Vivid Yellow
    "#DA33FF", // Vivid Purple
    "#33FFF9", // Vivid Cyan
    "#FF3333", // Bright Red
    "#33FFB5", // Bright Mint Green
    "#FF5733", // Bright Coral
    "#33D7FF", // Bright Sky Blue
    "#FFD700"  // Bright Gold
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 2.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
        >
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

interface CategoryData {
    name: string;
    value: number;
}

interface apiData {
    "Amount": number;
    "Expense/Income": string;
    "Date": string;
    "ModeOfPayment": string;
    "Category": string;
    "Message": string;
    "SalaryBifercationCat": string;
    "Minus": number;
    "Effective": number;
}

const Chart = (props: { allTransactions: apiData[]; }) => {

    const [categoryData, setCategoryData] = React.useState<CategoryData[]>([]);
    const [subCategoryData, setSubCategoryData] = React.useState<CategoryData[]>([]);

    const TOTAL_AMOUNT = 74000;

    React.useEffect(() => {
        // Process transactions to calculate category and sub-category sums
        const categorySums: { [key: string]: number } = {};
        const subCategorySums: { [key: string]: number } = {};

        let totalExpenses = 0;

        props.allTransactions.forEach((transaction: apiData) => {
            // Sum values for each main category
            const mainCategory = transaction.Category;
            if (categorySums[mainCategory]) {
                categorySums[mainCategory] += transaction.Effective;
            } else {
                categorySums[mainCategory] = transaction.Effective;
            }


            // Sum values for each sub-category
            const subCategory = transaction.SalaryBifercationCat;
            if (subCategorySums[subCategory]) {
                subCategorySums[subCategory] += transaction.Effective;
            } else {
                subCategorySums[subCategory] = transaction.Effective;
            }
            totalExpenses += transaction.Effective;
        });

        const savings = TOTAL_AMOUNT - totalExpenses;

        // Convert sums to arrays of objects
        const categoryArray = Object.keys(categorySums).map(key => ({
            name: key,
            value: categorySums[key]
        }));

        const subCategoryArray = Object.keys(subCategorySums).map(key => ({
            name: key,
            value: subCategorySums[key]
        }));

        if (savings > 0) {
            categoryArray.push({
                name: "Savings",
                value: savings
            });

            subCategoryArray.push({
                name: "Savings",
                value: savings
            });
        }

        setCategoryData(categoryArray);
        setSubCategoryData(subCategoryArray);

        console.log(categoryData);
    }, [categoryData, props.allTransactions]);
    
    return (
        <div>
            <Card sx={cardStyles}>
                <CardContent>
                    <Typography sx={balanceStyle}>
                        Category Wise Expenditure
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <PieChart width={300} height={370}>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={renderCustomizedLabel}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${entry}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <BarChart
                                width={300}
                                height={300}
                                data={subCategoryData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-55} // Slants the legend text at a 45-degree angle
                                    textAnchor="end" // Ensures the text anchors correctly at the end of the label
                                    height={80} // Increases the height to ensure the text fits within the chart area
                                    dy={1}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                            </BarChart>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default Chart