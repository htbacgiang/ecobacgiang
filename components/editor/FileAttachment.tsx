import { FC, useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { BsPaperclip, BsFileEarmark, BsDownload, BsTrash } from "react-icons/bs";
import { getFocusedEditor } from "./EditorUtils";

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface Props {
  editor: Editor | null;
}

const FileAttachment: FC<Props> = ({ editor }): JSX.Element | null => {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      await uploadFile(file);
    }
    
    setUploading(false);
    setShowFileUpload(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File): Promise<void> => {
    if (!editor) return;
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Simulate file upload - replace with actual API call
      const response = await fetch("/api/file-upload", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        const fileInfo: FileInfo = {
          id: result.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url,
        };
        
        setFiles(prev => [...prev, fileInfo]);
        
        // Insert file link into editor
        insertFileLink(fileInfo);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const insertFileLink = (fileInfo: FileInfo) => {
    if (!editor) return;
    
    const fileSize = formatFileSize(fileInfo.size);
    const fileIcon = getFileIcon(fileInfo.type);
    
    const fileHtml = `
      <div class="file-attachment" style="display: flex; align-items: center; padding: 8px; border: 1px solid #e5e7eb; border-radius: 6px; margin: 8px 0; background-color: #f9fafb;">
        <span style="margin-right: 8px; font-size: 20px;">${fileIcon}</span>
        <div style="flex: 1;">
          <div style="font-weight: 500; color: #374151;">${fileInfo.name}</div>
          <div style="font-size: 12px; color: #6b7280;">${fileSize} • ${fileInfo.type}</div>
        </div>
        <a href="${fileInfo.url}" download="${fileInfo.name}" style="color: #3b82f6; text-decoration: none;">
          <span style="font-size: 16px;">⬇️</span>
        </a>
      </div>
    `;
    
    getFocusedEditor(editor).insertContent(fileHtml).run();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📊";
    if (mimeType.includes("zip") || mimeType.includes("rar")) return "📦";
    return "📎";
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Early return after all hooks
  if (!editor) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFileUpload(!showFileUpload)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
        title="Đính kèm tệp"
      >
        <BsPaperclip size={14} />
        <span className="hidden sm:inline">Tệp</span>
      </button>

      {showFileUpload && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Đính kèm tệp</h3>
            <button
              onClick={() => setShowFileUpload(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* File Upload Area */}
          <div className="mb-4">
            <div
              onClick={openFileUpload}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              <BsPaperclip className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nhấp để tải lên tệp hoặc kéo thả
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Hỗ trợ: PDF, DOC, XLS, PPT, Hình ảnh, Video, Âm thanh
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mp3,.wav,.zip,.rar"
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-blue-600 dark:text-blue-400">Đang tải lên tệp...</span>
              </div>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tệp đã tải lên</h4>
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFileIcon(file.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-32">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => insertFileLink(file)}
                      className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Chèn vào trình soạn thảo"
                    >
                      <BsFileEarmark />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Xóa tệp"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Insert Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chèn nhanh</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const url = prompt("Nhập URL tệp:");
                  if (url) {
                    const fileName = prompt("Nhập tên tệp:");
                    if (fileName) {
                      const fileInfo: FileInfo = {
                        id: Date.now().toString(),
                        name: fileName,
                        size: 0,
                        type: "application/octet-stream",
                        url: url,
                      };
                      insertFileLink(fileInfo);
                    }
                  }
                }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
                              >
                  Chèn URL
                </button>
                <button
                  onClick={() => {
                    const fileName = prompt("Nhập tên tệp:");
                  if (fileName) {
                    const fileInfo: FileInfo = {
                      id: Date.now().toString(),
                      name: fileName,
                      size: 0,
                      type: "application/octet-stream",
                      url: "#",
                    };
                    insertFileLink(fileInfo);
                  }
                }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
                              >
                  Giữ chỗ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAttachment;
