import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { api } from "../services/api";
import { NutritionDay, Meal } from "../models/NutritionDay";
import { MealType } from "../models/Meal";
import { FiX } from "react-icons/fi";

function Nutrition() {
    const [nutrition, setNutrition] = useState<NutritionDay | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mealType, setMealType] = useState<MealType>(MealType.Snacks);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);

    useEffect(() => {
        loadNutrition();
    }, []);

    const loadNutrition = async () => {
        const nutritionData = await api.getNutritionToday();
        setNutrition(nutritionData);
    };

    const handleAddMeal = async () => {
        if (!nutrition) return;

        const meal: Omit<Meal, "id" | "nutritionDayId"> = {
            type: mealType,
            protein,
            fat,
            carbs
        };

        const newMeal = await api.addMeal(meal);
        setNutrition({
            ...nutrition,
            meals: [...nutrition.meals, newMeal],
            consumedCalories: nutrition.consumedCalories + (protein*4 + carbs*4 + fat*9)
        });

        setIsModalOpen(false);
        setProtein(0); setFat(0); setCarbs(0);
    };

    const handleDeleteMeal = async (mealId: string, calories: number) => {
        if (!nutrition) return;

        await api.deleteMeal(mealId);

        setNutrition({
            ...nutrition,
            meals: nutrition.meals.filter(m => m.id !== mealId),
            consumedCalories: nutrition.consumedCalories - calories
        });
    };

    if (!nutrition)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    const progress = Math.min(100, (nutrition.consumedCalories / nutrition.targetCalories) * 100);

    const mealLabels = {
        [MealType.Breakfast]: 'Завтрак',
        [MealType.Lunch]: 'Обед',
        [MealType.Dinner]: 'Ужин',
        [MealType.Snacks]: 'Перекусы'
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Питание</h1>
            </div>

            {/* Прогресс по калориям */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                    {nutrition.consumedCalories} <span className="text-xl text-gray-500">/ {nutrition.targetCalories} ккал</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {progress < 100 ? `Осталось ${nutrition.targetCalories - nutrition.consumedCalories} ккал` : 'Дневная норма достигнута!'}
                </p>
            </div>

            {/* Приёмы пищи */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Приемы пищи</h2>
                <div className="space-y-4">
                    {nutrition.meals.map((meal, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-800">{mealLabels[meal.mealType]}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{meal.protein*4 + meal.carbs*4 + meal.fat*9} ккал</span>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteMeal(meal.id, meal.protein*4 + meal.carbs*4 + meal.fat*9)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-600">Белки</p>
                                    <p className="font-bold text-blue-600">{meal.protein}г</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Жиры</p>
                                    <p className="font-bold text-yellow-600">{meal.fat}г</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Углеводы</p>
                                    <p className="font-bold text-green-600">{meal.carbs}г</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Кнопка для открытия модального окна */}
            <button
                className="bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold w-full mb-4 shadow-lg hover:bg-blue-600 transition"
                onClick={() => setIsModalOpen(true)}
            >
                Добавить прием пищи
            </button>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-xl w-86 p-6 relative animate-fadeIn">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FiX size={20} />
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Добавить прием пищи</h3>

                        <label className="block mb-1 font-medium text-gray-700">Тип приема пищи</label>
                        <select
                            className="border p-2 rounded mb-4 w-full"
                            value={mealType}
                            onChange={e => setMealType(e.target.value as MealType)}
                        >
                            <option value={MealType.Breakfast}>Завтрак</option>
                            <option value={MealType.Lunch}>Обед</option>
                            <option value={MealType.Dinner}>Ужин</option>
                            <option value={MealType.Snacks}>Перекусы</option>
                        </select>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Белки (г)</label>
                                <input
                                    type="number"
                                    min={0}
                                    className="border p-2 rounded w-full"
                                    value={protein}
                                    onChange={e => setProtein(Math.max(0, Number(e.target.value)))}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Жиры (г)</label>
                                <input
                                    type="number"
                                    min={0}
                                    className="border p-2 rounded w-full"
                                    value={fat}
                                    onChange={e => setFat(Math.max(0, Number(e.target.value)))}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium text-gray-700">Углеводы (г)</label>
                                <input
                                    type="number"
                                    min={0}
                                    className="border p-2 rounded w-full"
                                    value={carbs}
                                    onChange={e => setCarbs(Math.max(0, Number(e.target.value)))}
                                />
                            </div>
                        </div>

                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2"
                            onClick={handleAddMeal}
                        >
                            Добавить
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-full"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {/* Кнопки действий */}
            <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold text-center shadow-lg hover:bg-blue-600 transition">
                    Генерация рецепта с ИИ
                </button>
                <button className="bg-green-500 text-white py-3 px-4 rounded-xl font-semibold text-center shadow-lg hover:bg-green-600 transition">
                    Добавить по штрих-коду
                </button>
            </div>


            <BottomNavigation />
        </div>
    );
}

export default Nutrition;
