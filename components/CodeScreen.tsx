import React, { useState } from 'react';

interface CodeScreenProps {
  onBack: () => void;
  onVerify: (code: string) => void;
  isLoading: boolean;
  error: string | null;
}

interface NumpadButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}

const NumpadButton: React.FC<NumpadButtonProps> = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`bg-gray-800 hover:bg-gray-700 text-gray-50 font-bold py-4 rounded-lg text-2xl transition-colors ${className}`}
    >
        {children}
    </button>
);

const CodeScreen: React.FC<CodeScreenProps> = ({ onBack, onVerify, isLoading, error }) => {
  const [code, setCode] = useState('');
  const codeLength = 5;

  const handleNumpadClick = (value: string) => {
    if (code.length < codeLength) {
      setCode(code + value);
    }
  };

  const handleDelete = () => {
    if (code.length > 0) {
      setCode(code.slice(0, -1));
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleVerifyCode = () => {
    if (code.length === codeLength && !isLoading) {
        onVerify(code);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col text-gray-50">
      <div className="relative flex items-center justify-start h-12">
        <button onClick={onBack} className="absolute left-0 text-3xl text-gray-400 hover:text-gray-200 transition-colors" aria-label="Назад">
          &larr;
        </button>
      </div>

      <div className="flex-grow pt-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">🔑 Введите код:</h1>
        
        <div className="flex justify-center space-x-3 my-8">
          {Array.from({ length: codeLength }).map((_, index) => (
            <div
              key={index}
              className="w-12 h-14 flex items-center justify-center text-3xl font-semibold border-b-2 border-gray-600"
            >
              {code[index] || ''}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm">
          ☁️ Код пришел в приложении Telegram сюда (<a href="https://t.me/+42777" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">ссылка</a>)
        </p>
        
        {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}

        <div className="flex-grow"></div>
      </div>
      
      <div className="flex-shrink-0 pb-4">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <NumpadButton key={digit} onClick={() => handleNumpadClick(digit)}>
              {digit}
            </NumpadButton>
          ))}
          <NumpadButton onClick={handleClear} className="text-gray-400">X</NumpadButton>
          <NumpadButton onClick={() => handleNumpadClick('0')}>0</NumpadButton>
          <NumpadButton onClick={handleDelete} className="text-gray-400">&larr;</NumpadButton>
        </div>
        
        <button
          onClick={handleVerifyCode}
          disabled={code.length !== codeLength || isLoading}
          className={`w-full py-3 px-6 text-white font-bold rounded-xl text-lg transition-colors duration-300 ${
            (code.length === codeLength && !isLoading)
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Проверка...' : 'Проверить код'}
        </button>
      </div>
    </div>
  );
};

export default CodeScreen;
