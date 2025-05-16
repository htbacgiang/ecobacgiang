'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import LargeCard from "./LargeCard";

export default function OrderStatsCards() {
  const [stats, setStats] = useState([
    { period: "Hôm nay Orders", sale: 0, color: "bg-green-600" },
    { period: "Hôm qua Orders", sale: 0, color: "bg-blue-600" },
    { period: "Tháng này", sale: 0, color: "bg-orange-600" },
    { period: "Cả năm", sale: 0, color: "bg-purple-600" },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/orders");
      const orders = res.data.orders;

      const today = new Date().toLocaleDateString("vi-VN");
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("vi-VN");
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      let todayTotal = 0,
        yesterdayTotal = 0,
        monthTotal = 0,
        allTimeTotal = 0;

      orders.forEach(order => {
        if (order.status !== "cancelled") {
          const orderDate = new Date(order.createdAt);
          const orderDateString = orderDate.toLocaleDateString("vi-VN");

          if (orderDateString === today) todayTotal += order.finalTotal;
          if (orderDateString === yesterday) yesterdayTotal += order.finalTotal;
          if (orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear)
            monthTotal += order.finalTotal;

          allTimeTotal += order.finalTotal;
        }
      });

      setStats([
        { period: "Doanh thu hôm nay ", sale: todayTotal, color: "bg-green-600" },
        { period: "Doanh thu hôm qua", sale: yesterdayTotal, color: "bg-blue-600" },
        { period: "Tháng này", sale: monthTotal, color: "bg-orange-600" },
        { period: "Cả năm", sale: allTimeTotal, color: "bg-purple-600" },
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <LargeCard data={item} key={i} />
      ))}
    </div>
  );
}
