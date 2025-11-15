import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import {api} from "../services/api";

interface StepsBlockProps {
    steps: number;
    setSteps: (s: number) => void;
    stepGoal?: number; // цель по шагам, по умолчанию 10000
}

const StepsBlock: React.FC<StepsBlockProps> = ({ steps, setSteps, stepGoal = 10000 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState(steps);

    const handleSave = async () => {
        const sanitized = Math.max(0, inputValue);
        try {
            const updated = await api.addSteps(sanitized); // отправка на бэк
            setSteps(updated.steps); // обновление локально после ответа
            setIsModalOpen(false);
        } catch (err) {
            console.error("Не удалось обновить шаги:", err);
        }
    };
    
    const stepProgress = Math.min(100, (steps / stepGoal) * 100);
    const caloriesBurned = Math.round(steps * 0.05); // 1 шаг ≈ 0.05 ккал
    const km = (steps / 1300).toFixed(1); // 1300 шагов ≈ 1 км
    const stepsLeft = Math.max(0, stepGoal - steps);
    
    return (
        <>
            {/* Основной блок статистики */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 text-center relative">
                <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                    Количество шагов сегодня
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FiEdit2 size={20} />
                    </button>
                </h2>

                {/* Сетка быстрых показателей */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                        <p className="text-gray-600 text-sm">Шаги</p>
                        <p className="text-2xl font-bold text-gray-800">{steps}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                        <p className="text-gray-600 text-sm">Калории</p>
                        <p className="text-2xl font-bold text-gray-800">{caloriesBurned}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                        <p className="text-gray-600 text-sm">Км</p>
                        <p className="text-2xl font-bold text-gray-800">{km}</p>
                    </div>
                </div>

                {/* Прогресс-бары */}
                <div className="mb-2">
                    <p className="text-gray-600 text-sm mb-1">Пройдено шагов</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div
                            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${stepProgress}%` }}
                        ></div>
                    </div>
                    {/* Текст с оставшимися шагами и процентом */}
                    <p className="text-sm text-gray-600">
                        {stepsLeft > 0
                            ? `Осталось пройти ${stepsLeft} шагов (${Math.round(stepProgress)}%)`
                            : `Цель достигнута! (${Math.round(stepProgress)}%)`}
                    </p>
                </div>
            </div>

            {/* Модальное окно редактирования шагов */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-xl w-80 p-6 relative animate-fadeIn">
                        <h3 className="text-xl font-semibold mb-4 text-center">Редактировать шаги</h3>
                        <input
                            type="number"
                            min={0}
                            className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={inputValue}
                            onChange={(e) => setInputValue(Number(e.target.value))}
                        />
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleSave}
                            >
                                Сохранить
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StepsBlock;

