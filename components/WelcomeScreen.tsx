
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <div className="text-8xl mb-8">👋</div>
      <h1 className="text-3xl font-bold mb-12 text-gray-50">
        Добро пожаловать в NonStop
      </h1>
      <button
        onClick={onStart}
        className="w-full max-w-sm py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Начать
      </button>
    </div>
  );
};

export default WelcomeScreen;
