import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { Session } from 'next-auth';
import Head from 'next/head';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  RotateCcw,
  Download,
  Play,
  Trash2,
  Eye
} from 'lucide-react';
import ConversationModal from '../../components/backend/ConversationModal';

interface Conversation {
  _id: string;
  session_id: string;
  timestamp: string;
  user_message: string;
  bot_response: string;
  user_info?: {
    name?: string;
    email?: string;
    gender?: string;
  };
  intent: string;
  confidence: number;
  training_ready: boolean;
  training_status: 'pending' | 'processed' | 'failed';
  metadata?: any;
}

interface ConversationStats {
  total_conversations: number;
  training_ready: number;
  processed: number;
  pending: number;
  failed: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ConversationsDashboard() {
  const { data: session, status } = useSession() as { 
    data: Session | null; 
    status: "loading" | "authenticated" | "unauthenticated" 
  };
  const router = useRouter();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [trainingLoading, setTrainingLoading] = useState(false);
  
  // Modal state
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    intent: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  
  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_PYTHON_AI_SERVICE_URL || 'http://localhost:5000';

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !session.user) {
      router.push('/dang-nhap');
      return;
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    fetchStats();
    fetchConversations();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/conversations/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchConversations = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.intent && { intent: filters.intent }),
        ...(filters.dateFrom && { date_from: filters.dateFrom }),
        ...(filters.dateTo && { date_to: filters.dateTo })
      });

      const response = await fetch(`${API_BASE}/conversations?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchConversations(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      intent: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchConversations(1);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchConversations(page);
  };

  const startTraining = async () => {
    if (!confirm('Bạn có chắc muốn bắt đầu training chatbot từ conversations?')) return;
    
    setTrainingLoading(true);
    try {
      const response = await fetch(`${API_BASE}/training/from-conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 1000, update_intents: true })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Training thành công! ${data.message}`);
        fetchStats();
        fetchConversations();
      } else {
        alert(`Training thất bại: ${data.error}`);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      alert('Có lỗi xảy ra khi training');
    } finally {
      setTrainingLoading(false);
    }
  };

  const cleanupOldConversations = async () => {
    if (!confirm('Bạn có chắc muốn xóa conversations cũ hơn 90 ngày?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/conversations/cleanup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days_old: 90 })
      });
      
      const data = await response.json();
      if (data.success) {
        alert(`Đã xóa ${data.deleted_count} conversations cũ`);
        fetchStats();
        fetchConversations();
      } else {
        alert(`Cleanup thất bại: ${data.error}`);
      }
    } catch (error) {
      console.error('Error cleaning up:', error);
      alert('Có lỗi xảy ra khi cleanup');
    }
  };

  const exportData = async (format: 'json' | 'intents') => {
    try {
      const response = await fetch(`${API_BASE}/conversations/export?format=${format}`);
      const data = await response.json();
      
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversations_${format}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Có lỗi xảy ra khi export');
    }
  };

  const openConversationModal = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsModalOpen(true);
  };

  const closeConversationModal = () => {
    setIsModalOpen(false);
    setSelectedConversation(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Quản lý Conversations - Dashboard | Eco Bắc Giang</title>
        <meta name="description" content="Quản lý conversations và training chatbot" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                                 <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Conversations</h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={startTraining}
                  disabled={trainingLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                                     {trainingLoading ? (
                     <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                   ) : (
                     <Play className="w-4 h-4 mr-2" />
                   )}
                  Training Chatbot
                </button>
                <button
                  onClick={() => exportData('json')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                                     <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </button>
                <button
                  onClick={cleanupOldConversations}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                                     <Trash2 className="w-4 h-4 mr-2" />
                  Cleanup
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                                             <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tổng Conversations</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_conversations}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                                             <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Chờ Training</dt>
                        <dd className="text-lg font-medium text-yellow-600">{stats.pending}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                                             <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Đã Training</dt>
                        <dd className="text-lg font-medium text-green-600">{stats.processed}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                                             <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Training Lỗi</dt>
                        <dd className="text-lg font-medium text-red-600">{stats.failed}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                                             <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Sẵn sàng Training</dt>
                        <dd className="text-lg font-medium text-blue-600">{stats.training_ready}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="pending">Chờ training</option>
                    <option value="processed">Đã training</option>
                    <option value="failed">Training lỗi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intent</label>
                  <input
                    type="text"
                    value={filters.intent}
                    onChange={(e) => handleFilterChange('intent', e.target.value)}
                    placeholder="Nhập intent..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Tìm trong message..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex items-end space-x-2">
                  <button
                    onClick={applyFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                                         <Filter className="w-4 h-4 mr-2" />
                    Lọc
                  </button>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Xóa lọc
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Conversations Table */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Danh sách Conversations</h3>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                                 <RotateCcw className="w-8 h-8 text-gray-400 mx-auto animate-spin" />
                <p className="mt-2 text-gray-500">Đang tải conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                                 <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-gray-500">Không có conversations nào</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User Message
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bot Response
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Intent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Confidence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           User Info
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Hành động
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {conversations.map((conversation) => (
                         <tr key={conversation._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(conversation.timestamp).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {conversation.user_message}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {conversation.bot_response}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {conversation.intent}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(conversation.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.training_status)}`}>
                              {getStatusIcon(conversation.training_status)}
                              <span className="ml-1">
                                {conversation.training_status === 'pending' && 'Chờ training'}
                                {conversation.training_status === 'processed' && 'Đã training'}
                                {conversation.training_status === 'failed' && 'Training lỗi'}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                         {conversation.user_info ? (
                               <div>
                                 {conversation.user_info.name && <div>{conversation.user_info.name}</div>}
                                 {conversation.user_info.email && <div className="text-gray-500">{conversation.user_info.email}</div>}
                               </div>
                             ) : (
                               <span className="text-gray-400">Không có</span>
                             )}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             <button
                               onClick={() => openConversationModal(conversation)}
                               className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                             >
                               <Eye className="w-4 h-4 mr-1" />
                               Xem
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} conversations
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>
                        
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-2 border text-sm font-medium rounded-md ${
                                pageNum === pagination.page
                                  ? 'border-green-500 text-green-600 bg-green-50'
                                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
                     </div>
         </div>
       </div>

       {/* Conversation Modal */}
       <ConversationModal
         conversation={selectedConversation}
         isOpen={isModalOpen}
         onClose={closeConversationModal}
       />
     </>
   );
 }
