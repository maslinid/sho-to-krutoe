import React, { useState } from 'react';
import Modal from './Modal';
import RequiredStar from './RequiredStar';
import { AuthSettings } from '../App';


interface SettingItemProps {
  prefix: '├' | '└';
  label: string;
  value: string;
  isRequired?: boolean;
  onEdit: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ prefix, label, value, isRequired, onEdit }) => {
  const hasValue = value.trim() !== '';

  return (
    <div className="flex items-center justify-between text-base py-3">
      <div className="flex items-center">
        <span className="text-gray-500 mr-3">{prefix}</span>
        <span className="text-gray-200">{label}: {isRequired && <RequiredStar />}</span>
      </div>
      <div className="flex items-center">
        {hasValue && <span className="text-gray-400 max-w-[120px] truncate mr-2">{value}</span>}
        <button onClick={onEdit} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-right">
          {hasValue ? 'Изменить' : 'Указать'}
        </button>
      </div>
    </div>
  );
};

interface AuthScreenProps {
    onSendCode: (settings: AuthSettings) => void;
    isLoading: boolean;
    error: string | null;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSendCode, isLoading, error }) => {
    const [settings, setSettings] = useState<AuthSettings>({
        apiId: '',
        apiHash: '',
        phoneNumber: '',
        proxy: '',
    });

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        field: keyof typeof settings | null;
        title: string;
        description?: string;
    }>({ isOpen: false, field: null, title: '' });

    const handleOpenModal = (field: keyof typeof settings, title: string, description?: string) => {
        setModalConfig({ isOpen: true, field, title, description });
    };

    const handleCloseModal = () => {
        setModalConfig({ isOpen: false, field: null, title: '' });
    };

    const handleSaveSetting = (value: string) => {
        if (modalConfig.field) {
            setSettings(prev => ({ ...prev, [modalConfig.field!]: value }));
        }
        handleCloseModal();
    };

    const isFormComplete = settings.apiId.trim() !== '' && settings.apiHash.trim() !== '' && settings.phoneNumber.trim() !== '';

    const handleSendCodeClick = () => {
        if (!isLoading && isFormComplete) {
            onSendCode(settings);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto min-h-screen flex flex-col">
            <div className="flex-grow pt-4">
                <p className="text-gray-300 mb-6">
                    NonStop необходимо выполнить подключение к аккаунту. Для этого бот должен авторизоваться в ваш аккаунт.
                </p>
                
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-1 text-gray-50">⚙️ Настройки авторизации</h2>
                    <a href="https://telegra.ph/FAQ-Garvis-dlya-teh-kto-prohodit-registraciyu-04-04" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
                        (подробнее в статье)
                    </a>
                    <div className="bg-gray-800 rounded-lg mt-3 divide-y divide-gray-700 px-4">
                        <SettingItem prefix="├" label="API ID" value={settings.apiId} isRequired onEdit={() => handleOpenModal('apiId', 'Укажите API ID')} />
                        <SettingItem prefix="├" label="API HASH" value={settings.apiHash} isRequired onEdit={() => handleOpenModal('apiHash', 'Укажите API HASH')} />
                        <SettingItem prefix="├" label="Номер телефона" value={settings.phoneNumber} isRequired onEdit={() => handleOpenModal('phoneNumber', 'Укажите Номер телефона')} />
                        <SettingItem prefix="└" label="Прокси" value={settings.proxy} onEdit={() => handleOpenModal('proxy', 'Укажите Прокси', 'Можно ввести только Socks5 или HTTPS')} />
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-3 text-gray-50">👀 Есть вопросы?</h2>
                    <div className="bg-gray-800 rounded-lg divide-y divide-gray-700 px-4 text-base">
                        <div className="py-3 flex items-center">
                            <span className="text-gray-500 mr-3">├</span>
                            <span className="text-gray-200">Справочник по входу: </span>
                            <a href="https://telegra.ph/FAQ-Garvis-dlya-teh-kto-prohodit-registraciyu-04-04" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">в статье</a>
                        </div>
                        <div className="py-3 flex items-center">
                            <span className="text-gray-500 mr-3">├</span>
                            <span className="text-gray-200">Новостной канал: </span>
                            <a href="https://t.me/newsnonstop" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">@newsnonstop</a>
                        </div>
                        <div className="py-3 flex items-center">
                            <span className="text-gray-500 mr-3">└</span>
                            <span className="text-gray-200">Наш чат: </span>
                            <a href="https://t.me/+po8TBOAto-82NzQy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">присоединиться</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex-shrink-0 pb-4">
                 {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <button
                    onClick={handleSendCodeClick}
                    disabled={!isFormComplete || isLoading}
                    className={`w-full py-3 px-6 text-white font-bold rounded-xl text-lg transition-colors duration-300 ${
                        isFormComplete && !isLoading
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? 'Отправка...' : 'Отправить код'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                    Продолжая, вы принимаете <a href="https://telegra.ph/Polzovatelskoe-soglashenie-ispolzovaniya-bota-Garvis-07-29" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">пользовательское соглашение</a>.
                </p>
            </div>

            <Modal 
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                onSave={handleSaveSetting}
                title={modalConfig.title}
                initialValue={modalConfig.field ? settings[modalConfig.field] : ''}
                description={modalConfig.description}
            />
        </div>
    );
};

export default AuthScreen;
