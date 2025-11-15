import React, { useState } from "react";
import { api } from "../services/api";
import { WorkoutExercise, WorkoutSet } from "../models/WorkoutExercise";
import { FiPlus, FiX } from "react-icons/fi";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    defaultDate: Date;
    onWorkoutCreated: () => void;
}

const CreateWorkoutModal: React.FC<Props> = ({ isOpen, onClose, defaultDate, onWorkoutCreated }) => {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(60);
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const addExercise = () => setExercises([...exercises, { id: "", workoutId: "", name: "", completed: false, sets: [] }]);
    const addSet = (exIdx: number) => {
        const copy = [...exercises];
        copy[exIdx].sets.push({ id: "", workoutExerciseId: "", reps: 10, weight: 0, completed: false });
        setExercises(copy);
    };

    const handleExerciseChange = (idx: number, name: string) => {
        const copy = [...exercises];
        copy[idx].name = name;
        setExercises(copy);
    };

    const handleSetChange = (exIdx: number, setIdx: number, reps: number, weight: number) => {
        const copy = [...exercises];
        copy[exIdx].sets[setIdx].reps = reps;
        copy[exIdx].sets[setIdx].weight = weight;
        setExercises(copy);
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Название тренировки не может быть пустым");
            return;
        }
        if (exercises.length === 0) {
            setError("Добавьте хотя бы одно упражнение");
            return;
        }

        try {
            const payload = {
                title,
                date: defaultDate.toISOString(),
                durationMinutes: duration,
                exercises: exercises.map(ex => ({
                    name: ex.name,
                    sets: ex.sets.map(s => ({
                        reps: s.reps,
                        weight: s.weight
                    }))
                }))
            };
            await api.createWorkout(payload);
            setTitle("");
            setDuration(60);
            setExercises([]);
            setError("");
            onWorkoutCreated();
            onClose();
        } catch (err) {
            console.error(err);
            setError("Ошибка при создании тренировки");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn
                max-h-[90vh] flex flex-col">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <FiX size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">Создать тренировку</h2>

                {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

                <div className="overflow-y-auto pr-2 flex-1">
                    <div className="mb-3">
                        <label className="block mb-1 font-medium text-gray-700">Название тренировки</label>
                        <input
                            type="text"
                            placeholder="Название тренировки"
                            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
    
                    <div className="mb-3">
                        <label className="block mb-1 font-medium text-gray-700">Длительность (мин)</label>
                        <input
                            type="number"
                            placeholder="Длительность (мин)"
                            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                        />
                    </div>
    
                    {exercises.map((ex, idx) => (
                    <div key={idx} className="mb-3 border rounded p-3 bg-gray-50">
                        <div className="mb-2">
                            <div className="flex-1">
                                <label className="block mb-1 font-medium text-gray-700">{`Упражнение ${idx + 1}`}</label>
                                <input
                                    type="text"
                                    placeholder={`Название упражнения ${idx + 1}`}
                                    className="border p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={ex.name}
                                    onChange={(e) => handleExerciseChange(idx, e.target.value)}
                                />
                            </div>
                            
                            <button
                                onClick={() => addSet(idx)}
                                className="ml-2 mt-2 text-sm text-blue-600 hover:underline flex items-center"
                            >
                                <FiPlus className="mr-1" /> Добавить подход
                            </button>
                        </div>

                        {ex.sets.map((s, sIdx) => (
                            <div key={sIdx} className="flex gap-2 items-center mb-1 ml-2">
                                <div>
                                    <label className="text-sm text-gray-600">Повторы - </label>
                                    <input
                                        type="number"
                                        placeholder="Повторы"
                                        className="border p-1 rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={s.reps}
                                        onChange={(e) => handleSetChange(idx, sIdx, Number(e.target.value), s.weight)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Вес кг - </label>
                                    <input
                                        type="number"
                                        placeholder="Вес кг"
                                        className="border p-1 rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={s.weight}
                                        onChange={(e) => handleSetChange(idx, sIdx, s.reps, Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button onClick={addExercise} className="text-sm text-blue-600 hover:underline flex items-center">
                        <FiPlus className="mr-1" /> Добавить упражнение
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Создать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkoutModal;
