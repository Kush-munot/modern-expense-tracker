/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Topbar from "@/components/Topbar/Topbar";
import "./page.css";
import React from "react";
import BalanceGrid from "@/components/BalanceGrid/BalanceGrid";
import TransactionAndAnalytics from "@/components/TransactionAnd Analytics/Analytics";




export default function Home() {
  const [sheetData, setSheetData] = React.useState([]);

  const handleAddTransaction = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSheetData(data)
      console.log(sheetData);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    handleAddTransaction();
  }, []);


  return (
    <div className="page">
      <Topbar onTransactionAdded={handleAddTransaction} />
      <BalanceGrid allTransactions={sheetData} />
      <TransactionAndAnalytics allTransactions={sheetData}/>
    </div>
  );
}
