import { FC } from "react";

interface Props {
  status: string;
  isVisible: boolean;
}

const AutoSaveIndicator: FC<Props> = ({ status, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          {status === "Đã lưu nháp" || status.includes("công khai bài viết thành công") ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : status === "Lỗi lưu nháp" || status.includes("Lỗi công khai") ? (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : status.includes("Vui lòng lưu nháp") ? (
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ) : (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveIndicator;
