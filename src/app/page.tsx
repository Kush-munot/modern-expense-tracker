"use client"
import Topbar from "@/components/Topbar/Topbar";
import "./page.css";
import React from "react";



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
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div className="page">
      <Topbar onTransactionAdded={handleAddTransaction} />
    </div>
  );
}
