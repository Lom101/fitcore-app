import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { api } from "../services/api";
import { User } from "../models/User";
import {FiEdit} from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState<number | "">(user?.weightKg ?? "");


  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await api.getUser();

      // Гарантируем, что массивы существуют
      setUser({
        ...userData,
        workouts: userData.workouts ?? [],
        measurements: userData.measurements ?? [],
        nutritionDays: userData.nutritionDays ?? []
      });
    } catch (err) {
      console.error("Ошибка загрузки профиля:", err);
    }
  };

  if (!user)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

  // ---------- Статы ----------
  const totalWorkouts = user?.workouts?.length ?? 0;

  const startWeight = user?.measurements?.length
      ? user.measurements[0].weightKg
      : null;

  const latestWeight = user?.measurements?.length
      ? user.measurements[user.measurements.length - 1].weightKg
      : null;

  const todayNutrition = user?.nutritionDays?.length
      ? user.nutritionDays[user.nutritionDays.length - 1]
      : null;

  const nutritionProgress =
      todayNutrition
          ? Math.min(
              100,
              (todayNutrition.consumedCalories / todayNutrition.targetCalories) * 100
          )
          : 0;

  return (
      <div className="min-h-screen bg-gray-50 p-6 pb-20">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Профиль</h1>
        </div>

        {/* Информация пользователя */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
            {user.username
                .split(' ')
                .map((n) => n[0])
                .join('')}
          </div>

          <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>

          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2">
            {user.isPremium ? '🏆 Премиум' : 'Базовый'}
          </div>

          <p className="text-gray-600 mt-2">
            Присоединился в {new Date(user.createdAt).getFullYear()}
          </p>
        </div>

        {/* Блок достижений */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Достижения</h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{totalWorkouts}</p>
              <p className="text-sm text-gray-600">Тренировки</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
              <p className="text-2xl font-bold text-green-600">
                <span className="font-bold">{user?.weightKg ?? "-" } кг</span>
                <button
                    className="text-gray-500 hover:text-gray-700 ml-2"
                    onClick={() => setIsWeightModalOpen(true)}
                >
                  <FiEdit size={18} />
                </button>
              </p>
              <div className="flex justify-center items-center mt-2 gap-2">
                <p className="text-sm text-gray-600">
                  Собственный вес
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Соблюдение питания за сегодня</p>
            <p className="text-2xl font-bold text-purple-600">{nutritionProgress.toFixed(0)}%</p>
          </div>
        </div>

        {/* Ежемесячный обзор */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Ежемесячный обзор</h2>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{totalWorkouts}</p>
              <p className="text-blue-100">Тренировки</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold">
                {new Date().toLocaleString('ru-RU', { month: 'long' })}
              </p>
              <p className="text-blue-100">{new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {isWeightModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Редактировать вес</h3>
                <input
                    type="number"
                    min={0}
                    className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={weightInput}
                    onChange={(e) => setWeightInput(Number(e.target.value))}
                />
                <div className="flex justify-between">
                  <button
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                      onClick={() => setIsWeightModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                      className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        if (weightInput > 0 && user) {
                          api.updateWeight(weightInput)
                              .then(() => {
                                setUser({ ...user, weightKg: weightInput });
                                setIsWeightModalOpen(false);
                              });
                        }
                      }}
                  >
                    Сохранить
                  </button> 
                </div>
              </div>
            </div>
        )}


        <BottomNavigation />
      </div>
  );
}

export default Profile;
