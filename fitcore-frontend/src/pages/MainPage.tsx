import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate();

    const buttons = [
        { label: 'Главная', path: '/dashboard', color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
        { label: 'Тренировки', path: '/training', color: 'bg-green-500', hover: 'hover:bg-green-600' },
        { label: 'Питание', path: '/nutrition', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
        { label: 'Профиль', path: '/profile', color: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Добро пожаловать в FitCore!</h1>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                Здесь вы можете отслеживать свои тренировки, питание и прогресс.
            </p>

            <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
                {buttons.map(btn => (
                    <button
                        key={btn.path}
                        onClick={() => navigate(btn.path)}
                        className={`${btn.color} text-white py-3 px-6 rounded-lg shadow ${btn.hover} transition`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
