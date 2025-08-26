// components/common/ConfirmModal.tsx
import { FC } from "react";
import Modal from "react-modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel} ariaHideApp={false} className="p-4 bg-white rounded shadow-lg max-w-md mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-2 border rounded">Hủy</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Xác nhận</button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
