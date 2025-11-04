
import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  initialValue: string;
  description?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, title, initialValue, description }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) {
    return null;
  }
  
  const handleSave = () => {
    onSave(inputValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-gray-50">{title}</h2>
        {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-gray-700 text-gray-50 border border-gray-600 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-gray-600 hover:bg-gray-500 text-gray-50 font-semibold rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
