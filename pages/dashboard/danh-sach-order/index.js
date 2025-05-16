import React from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import OrderList from '../../../components/ecobacgiang/OrderList';
import OrderStats from '../../../components/ecobacgiang/OrderStats';
import TopProducts from '../../../components/ecobacgiang/TopProducts';
import TopCustomers from '../../../components/ecobacgiang/TopCustomers';

export default function OrdersPage() {
  return (
    <AdminLayout title="Danh sách đơn hàng">
      <div className="p-2 bg-white dark:bg-slate-900 text-gray-800 min-h-screen">
        {/* Recent Orders Table */}
        <OrderStats />
        <TopProducts />
        <OrderList />
        <TopCustomers />
      </div>
    </AdminLayout>
  );
}