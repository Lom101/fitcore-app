import { useNavigate } from 'react-router-dom';
import React from 'react';
import BottomNavigation from '../components/BottomNavigation';

function CoachPanel() {
  const navigate = useNavigate();

  const exampleQuestions = [
    "Создайте план тренировок для похудения",
    "Что мне следует есть перед тренировкой?",
    "Как я могу улучшить свое время бега?",
    "Почему вес встал на сушке?",
    "Сколько протеина нужно в день?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI Коуч</h1>
      </div>

      {/* Основная информация */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Получите персонализированные планы</h2>
        <p className="text-gray-600 mb-4">
          Наш AI коуч создаст индивидуальные планы тренировок, даст советы по питанию 
          и проанализирует ваш прогресс
        </p>
        
        <button 
          onClick={() => navigate('/coach/chat')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-center shadow-lg hover:from-blue-600 hover:to-purple-700 transition mb-4"
        >
          💬 Начать беседу с AI Коучем
        </button>
      </div>

      {/* Как использовать */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Как использовать</h2>
        
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">✓</div>
            <span className="text-gray-700">Начните беседу - спрашивайте о планах тренировок, питании или прогрессе</span>
          </div>
          
          <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">2</div>
            <span className="text-gray-700">Получайте персонализированные ответы на основе ваших данных</span>
          </div>
          
          <div className="flex items-center p-3 bg-purple-50 rounded-xl border border-purple-200">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-3">3</div>
            <span className="text-gray-700">Внедряйте рекомендации и отслеживайте прогресс</span>
          </div>
        </div>
      </div>

      {/* Примеры вопросов */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Примеры вопросов</h2>
        
        <div className="space-y-3">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => navigate('/coach/chat', { state: { initialQuestion: question } })}
              className="w-full text-left p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition text-gray-700"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default CoachPanel;