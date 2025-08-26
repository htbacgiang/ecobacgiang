import { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import ConfirmDialog from "../common/ConfirmDialog";

interface Draft {
  _id: string;
  title: string;
  content: string;
  slug: string;
  meta: string;
  category: string;
  tags: string[];
  thumbnail?: { url: string; public_id: string };
  createdAt: string;
  updatedAt: string;
}

interface Props {
  onSelectDraft: (draft: Draft) => void;
  onClose: () => void;
  visible: boolean;
}

const DraftList: FC<Props> = ({ onSelectDraft, onClose, visible }) => {
  const { data: session } = useSession();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);

  const fetchDrafts = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get("/api/posts/draft");
      setDrafts(data.drafts);
    } catch (error) {
      console.error("Lỗi lấy danh sách nháp:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (draft: Draft) => {
    setDraftToDelete(draft);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!draftToDelete) return;
    
    try {
      await axios.delete(`/api/posts/${draftToDelete._id}`);
      setDrafts(drafts.filter(draft => draft._id !== draftToDelete._id));
      toast.success("Nháp bài viết đã được xóa thành công!");
    } catch (error: any) {
      console.error("Lỗi xóa nháp:", error);
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra khi xóa nháp bài viết!";
      toast.error(errorMessage);
    } finally {
      setShowConfirmDelete(false);
      setDraftToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setDraftToDelete(null);
  };

  useEffect(() => {
    if (visible) {
      fetchDrafts();
    }
  }, [visible, session]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Danh sách bài viết nháp
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Chưa có bài viết nháp nào</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4">
                {drafts.map((draft) => (
                  <div
                    key={draft._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-800 dark:text-white">
                            {draft.title || "Nháp bài viết"}
                          </h3>
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Nháp
                          </span>
                        </div>
                        
                        {draft.thumbnail && (
                          <img
                            src={draft.thumbnail.url}
                            alt="Thumbnail"
                            className="w-16 h-16 object-cover rounded mb-2"
                          />
                        )}
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {draft.meta || "Chưa có mô tả"}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            Cập nhật: {formatDistanceToNow(new Date(draft.updatedAt), { 
                              addSuffix: true, 
                              locale: vi 
                            })}
                          </span>
                          {draft.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {draft.category}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => onSelectDraft(draft)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteClick(draft)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        visible={showConfirmDelete}
        title="Xác nhận xóa nháp"
        message={`Bạn có chắc muốn xóa nháp "${draftToDelete?.title || 'Nháp bài viết'}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </>
  );
};

export default DraftList;
