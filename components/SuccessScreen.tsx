import React from 'react';

interface SuccessScreenProps {
  from2FA: boolean;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ from2FA }) => {
    
    const handleGoToMenu = () => {
        console.log("Navigating to menu...");
        // In a real Telegram Web App, you might use:
        // if (window.Telegram?.WebApp) {
        //   window.Telegram.WebApp.close();
        // }
    };

    const successMessage = from2FA 
        ? "✅ 2FA Код введен верно! Авторизация прошла успешно" 
        : "✅ Код введен верно! Авторизация прошла успешно";

    return (
        <div className="flex flex-col items-center justify-between h-screen p-6 text-center">
            <div className="flex-grow flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-6 text-gray-50">
                    {successMessage}
                </h1>
                <p className="text-gray-400 max-w-md">
                    💡 Расширение работает с подпиской. Если вы новый пользователь, активируйте бесплатный период по инструкции в меню.
                </p>
            </div>
            <div className="w-full max-w-sm pb-4">
                 <button
                    onClick={handleGoToMenu}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Перейти в меню
                </button>
            </div>
        </div>
    );
};

export default SuccessScreen;
