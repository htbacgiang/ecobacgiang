import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ConversationStats {
  total_conversations: number;
  training_ready: number;
  processed: number;
  pending: number;
  failed: number;
}

export default function ConversationStats() {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_PYTHON_AI_SERVICE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/conversations/stats`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Không thể tải thống kê conversations');
      }
    } catch (error) {
      console.error('Error fetching conversation stats:', error);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
         {
       title: 'Tổng Conversations',
       value: stats.total_conversations,
       icon: MessageSquare,
       color: 'text-blue-600',
       bgColor: 'bg-blue-100',
       href: '/dashboard/conversations'
     },
         {
       title: 'Chờ Training',
       value: stats.pending,
       icon: Clock,
       color: 'text-yellow-600',
       bgColor: 'bg-yellow-100',
       href: '/dashboard/conversations?status=pending'
     },
         {
       title: 'Đã Training',
       value: stats.processed,
       icon: CheckCircle,
       color: 'text-green-600',
       bgColor: 'bg-green-100',
       href: '/dashboard/conversations?status=processed'
     },
         {
       title: 'Training Lỗi',
       value: stats.failed,
       icon: AlertTriangle,
       color: 'text-red-600',
       bgColor: 'bg-red-100',
       href: '/dashboard/conversations?status=failed'
     },
         {
       title: 'Sẵn sàng Training',
       value: stats.training_ready,
       icon: MessageSquare,
       color: 'text-purple-600',
       bgColor: 'bg-purple-100',
       href: '/dashboard/conversations?training_ready=true'
     }
  ];

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Thống kê Conversations</h2>
                     <Link
             href="/dashboard/conversations"
             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
           >
             <MessageSquare className="w-4 h-4 mr-2" />
             Xem tất cả
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                href={stat.href}
                className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Hành động nhanh</h3>
          <div className="flex flex-wrap gap-3">
                         <Link
               href="/dashboard/conversations"
               className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
             >
               <MessageSquare className="w-4 h-4 mr-2" />
               Quản lý Conversations
             </Link>
                         <button
               onClick={() => window.open('/dashboard/conversations', '_blank')}
               className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
             >
               <Clock className="w-4 h-4 mr-2" />
               Training Status
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
