import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { api } from "../services/api";
import { User } from "../models/User";
import { Workout } from "../models/Workout";
import { NutritionDay } from "../models/NutritionDay";
import StepsBlock from "../components/StepsBlock";

function Dashboard() {
  // Хуки — ВСЕ в начале
  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutrition, setNutrition] = useState<NutritionDay | null>(null);
  const [loading, setLoading] = useState(true);

  const [steps, setSteps] = useState(0);
  const [stepsInput, setStepsInput] = useState<number | "">(0);

  // Загрузка данных
  useEffect(() => {
    loadData();
    loadSteps();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, workoutsData, nutritionData] = await Promise.all([
        api.getUser(),
        api.getWorkouts(),
        api.getNutritionToday()
      ]);

      setUser(userData);
      setWorkouts(workoutsData);
      setNutrition(nutritionData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSteps = async () => {
    try {
      const stepData = await api.getStepsToday();
      setSteps(stepData.steps);
      setStepsInput(stepData.steps);
    } catch (err) {
      console.error(err);
    }
  };


  if (loading)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

  // Сегодняшние тренировки
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysWorkouts = workouts.filter(w => w.date.split('T')[0] === todayStr);

  return (
      <div className="min-h-screen bg-gray-50 p-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">FitCore</h1>
        </div>

        {/* Сегодняшняя тренировка */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Сегодняшняя тренировка</h2>
          {todaysWorkouts.length === 0 ? (
              <p className="text-gray-600">Нет тренировок на сегодня</p>
          ) : (
              todaysWorkouts.map(w => (
                  <div key={w.id} className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-2">
                    <p className="text-blue-600 font-bold text-xl">{w.title}</p>
                    <p className="text-gray-600 mt-1">{w.durationMinutes} минут</p>
                  </div>
              ))
          )}
        </div>

        {/* Калории сегодня */}
        {nutrition && (() => {
          const progress = Math.min(100, (nutrition.consumedCalories / nutrition.targetCalories) * 100);
          return (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 text-center">
                {/* Основной блок с цифрами */}
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {nutrition.consumedCalories}{" "}
                  <span className="text-xl text-gray-500">/ {nutrition.targetCalories} ккал</span>
                </div>

                {/* Прогресс-бар */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {/* Подпись с оставшимися калориями */}
                <p className="text-sm text-gray-600 mt-2">
                  {progress < 100
                      ? `Осталось ${nutrition.targetCalories - nutrition.consumedCalories} ккал`
                      : 'Дневная норма достигнута!'}
                </p>
              </div>
          );
        })()}

        {/* Шаги */}
          <StepsBlock
              steps={steps}
              setSteps={(newSteps) => setSteps(newSteps)}
          />

        {/* Приветствие пользователя */}
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            Добро пожаловать, <span className="font-semibold text-blue-600">{user.username}</span>!
          </p>
          {user.isPremium && (
              <span className="inline-block mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
            🏆 Премиум
          </span>
          )}
        </div>
        

        <BottomNavigation />
      </div>
  );
}

export default Dashboard;
