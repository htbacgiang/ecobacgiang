import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Filter, MoreVertical, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar, UserCheck, Save, X, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AllUsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [editingRole, setEditingRole] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [imageErrors, setImageErrors] = useState(new Set());

  const pageSize = 10;

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get('/api/user/check-admin');
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user?pageNo=${currentPage}&limit=${pageSize}`);
      setUsers(response.data.users);
      setTotalUsers(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Có lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [currentPage, isAdmin]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(a.createdAt || a.created_at);
      bValue = new Date(b.createdAt || b.created_at);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setEditingRole(false);
    setShowUserModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || newRole === selectedUser.role) {
      setEditingRole(false);
      return;
    }

    try {
      await axios.put(`/api/user/${selectedUser.id}`, {
        role: newRole
      });
      
      // Cập nhật danh sách users
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: newRole }
            : user
        )
      );
      
      // Cập nhật selectedUser
      setSelectedUser(prev => ({ ...prev, role: newRole }));
      
      setEditingRole(false);
      toast.success('Cập nhật vai trò thành công!');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Có lỗi khi cập nhật vai trò!');
    }
  };

  const handleImageError = (userId) => {
    setImageErrors(prev => new Set(prev).add(userId));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    
    // Tách tên thành các từ
    const words = name.trim().split(' ');
    
    if (words.length === 1) {
      // Chỉ có 1 từ, lấy 2 ký tự đầu
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Có nhiều từ, lấy ký tự đầu của từ đầu và từ cuối
      return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }
  };

  const renderAvatar = (user, size = 'w-10 h-10', textSize = 'text-sm') => {
    const imageUrl = user.avatar || user.image;
    const hasImageError = imageErrors.has(user.id);
    const shouldShowImage = imageUrl && !hasImageError;

    return (
      <div className={`${size} rounded-full overflow-hidden bg-emerald-500 flex items-center justify-center text-white font-bold relative`}>
        {shouldShowImage ? (
          <img 
            src={imageUrl} 
            alt={user.name || 'User avatar'} 
            className="w-full h-full object-cover"
            onError={() => handleImageError(user.id)}
            onLoad={() => {
              // Xóa lỗi nếu ảnh load thành công
              setImageErrors(prev => {
                const newSet = new Set(prev);
                newSet.delete(user.id);
                return newSet;
              });
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {getInitials(user.name)}
          </div>
        )}
        
        {/* Loading indicator */}
        {shouldShowImage && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse opacity-50" />
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', text: 'Admin' },
      premium: { color: 'bg-yellow-100 text-yellow-800', text: 'Premium' },
      user: { color: 'bg-green-100 text-green-800', text: 'User' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getVerificationBadge = (verified) => {
    return verified ? (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <UserCheck className="w-3 h-3 inline mr-1" />
        Đã xác thực
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
        Chưa xác thực
      </span>
    );
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có quyền truy cập</h3>
          <p className="text-gray-600">Bạn cần quyền admin để xem danh sách người dùng</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Danh sách người dùng</h2>
          <p className="text-gray-600">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>Tổng cộng: {totalUsers} người dùng</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">User</option>
              <option value="premium">Premium</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
            >
              <option value="createdAt-desc">Mới nhất</option>
              <option value="createdAt-asc">Cũ nhất</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                  STT
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-4 text-sm text-gray-500 font-medium">
                    {currentPage * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {renderAvatar(user)}
                      <div className="ml-3">
                        <div className="text-sm font-semibold text-gray-900">{user.name || 'Chưa có tên'}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}
                      {user.address && user.address.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="truncate">{user.address[0]?.cityName || 'Có địa chỉ'}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalUsers > pageSize && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalUsers)} của {totalUsers} người dùng
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                  {currentPage + 1}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * pageSize >= totalUsers}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết người dùng</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center space-x-4">
                  {renderAvatar(selectedUser, 'w-20 h-20', 'text-2xl')}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedUser.name || 'Chưa có tên'}</h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      {getVerificationBadge(selectedUser.emailVerified)}
                    </div>
                  </div>
                </div>

                {/* Role Management Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-900">Quản lý vai trò</h5>
                    {!editingRole && (
                      <button
                        onClick={() => setEditingRole(true)}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        Sửa vai trò
                      </button>
                    )}
                  </div>
                  
                  {editingRole ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                        >
                          <option value="user">User</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={handleUpdateRole}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Save className="w-4 h-4" />
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setEditingRole(false);
                            setNewRole(selectedUser.role || 'user');
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                          Hủy
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Vai trò hiện tại: {getRoleBadge(selectedUser.role)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Vai trò:</span>
                      {getRoleBadge(selectedUser.role)}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900">Thông tin liên hệ</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.gender && (
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedUser.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900">Thông tin khác</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Ngày tạo: {formatDate(selectedUser.createdAt)}</span>
                      </div>
                      {selectedUser.address && selectedUser.address.length > 0 && (
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <span className="block">Địa chỉ: {selectedUser.address.length} địa chỉ</span>
                            {selectedUser.address[0] && (
                              <span className="text-xs text-gray-500">
                                {selectedUser.address[0].address1}, {selectedUser.address[0].districtName}, {selectedUser.address[0].cityName}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                {selectedUser.address && selectedUser.address.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-900">Danh sách địa chỉ</h5>
                    <div className="space-y-2">
                      {selectedUser.address.map((addr, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{addr.fullName}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {addr.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>{addr.address1}</div>
                            <div>{addr.wardName}, {addr.districtName}, {addr.cityName}</div>
                            <div className="mt-1">{addr.phoneNumber}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
