import React from 'react';
import { X, User, Calendar, Tag, BarChart3 } from 'lucide-react';

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

interface ConversationModalProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationModal({ conversation, isOpen, onClose }: ConversationModalProps) {
  if (!isOpen || !conversation) return null;

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ training';
      case 'processed':
        return 'Đã training';
      case 'failed':
        return 'Training lỗi';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết Conversation
              </h3>
                             <button
                 onClick={onClose}
                 className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
               >
                 <X className="h-6 w-6" />
               </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Conversation Details */}
              <div className="space-y-6">
                {/* User Message */}
                <div>
                                     <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                     <User className="w-4 h-4 mr-2" />
                     Tin nhắn từ User
                   </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{conversation.user_message}</p>
                  </div>
                </div>

                {/* Bot Response */}
                <div>
                                     <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                     <Tag className="w-4 h-4 mr-2" />
                     Phản hồi từ Bot
                   </h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-gray-900">{conversation.bot_response}</p>
                  </div>
                </div>

                {/* Session Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Session ID</h4>
                  <p className="text-sm text-gray-900 font-mono bg-gray-100 px-3 py-2 rounded">
                    {conversation.session_id}
                  </p>
                </div>
              </div>

              {/* Right Column - Metadata */}
              <div className="space-y-6">
                {/* Timestamp */}
                <div>
                                     <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                     <Calendar className="w-4 h-4 mr-2" />
                     Thời gian
                   </h4>
                  <p className="text-sm text-gray-900">
                    {new Date(conversation.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>

                {/* Intent & Confidence */}
                <div>
                                     <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                     <BarChart3 className="w-4 h-4 mr-2" />
                     Intent & Confidence
                   </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Intent:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {conversation.intent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(conversation.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Training Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Trạng thái Training</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(conversation.training_status)}`}>
                        {getStatusText(conversation.training_status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ready for training:</span>
                      <span className={`text-sm font-medium ${conversation.training_ready ? 'text-green-600' : 'text-red-600'}`}>
                        {conversation.training_ready ? 'Có' : 'Không'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                {conversation.user_info && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Thông tin User</h4>
                    <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                      {conversation.user_info.name && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Tên:</span> {conversation.user_info.name}
                        </p>
                      )}
                      {conversation.user_info.email && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Email:</span> {conversation.user_info.email}
                        </p>
                      )}
                      {conversation.user_info.gender && (
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Giới tính:</span> {conversation.user_info.gender}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {conversation.metadata && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Metadata</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <pre className="text-xs text-gray-700 overflow-x-auto">
                        {JSON.stringify(conversation.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
