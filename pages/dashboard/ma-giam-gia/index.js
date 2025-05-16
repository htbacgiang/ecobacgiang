import React from 'react'
import AdminLayout from '../../../components/layout/AdminLayout'
import CouponForm from '../../../components/coupon/CouponForm'

export default function index() {
  return (
    <AdminLayout title="Danh sách khách hàng">
    <div className='p-2 bg-white dark:bg-slate-900 text-gray-800 min-h-screen'>
      {/* Rencent Orders Table */}
      <CouponForm />
    </div>

      </AdminLayout>

  )
}
