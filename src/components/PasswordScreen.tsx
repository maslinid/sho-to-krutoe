import React, { useState } from 'react';

const EyeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);


interface PasswordScreenProps {
  onBack: () => void;
  onConfirm: (password: string) => void;
  passwordHint?: string;
  isLoading: boolean;
  error: string | null;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onBack, onConfirm, passwordHint, isLoading, error }) => {
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const isButtonDisabled = password.trim() === '' || isLoading;

    const handleConfirm = () => {
        if (!isButtonDisabled) {
            onConfirm(password);
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
                <h1 className="text-2xl font-bold mb-6">🗝 Код введен верно, вход почти закончен. Введите пароль 2FA.</h1>
                
                <div className="relative mb-4">
                    <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ваш 2FA пароль"
                        className="w-full bg-gray-800 text-gray-50 border border-gray-600 rounded-lg p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                        autoFocus
                    />
                    <button 
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-200"
                        aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
                    >
                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>
                
                {passwordHint && (
                    <p className="text-sm text-gray-400">
                        💭 Подсказка к паролю: {passwordHint}
                    </p>
                )}
                
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex-grow"></div>
            </div>
            
            <div className="flex-shrink-0 pb-4">
                <button
                    onClick={handleConfirm}
                    disabled={isButtonDisabled}
                    className={`w-full py-3 px-6 text-white font-bold rounded-xl text-lg transition-colors duration-300 ${
                        !isButtonDisabled
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? 'Подтверждение...' : 'Подтвердить пароль'}
                </button>
            </div>
        </div>
    );
};

export default PasswordScreen;
