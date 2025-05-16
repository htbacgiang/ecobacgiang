import React from 'react'
import BestSellingProductsChart from './BestSellingProductsChart'

export default function DashboardCharts() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <BestSellingProductsChart />
      
    </div>
  )
}
