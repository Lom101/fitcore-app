import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { api } from "../services/api";
import {Workout} from "../models/Workout";
import {WorkoutExercise} from "../models/WorkoutExercise";
import {WorkoutSet} from "../models/WorkoutSet";
import CreateWorkoutModal from "../components/CreateWorkout";
import {FiPlus, FiTrash} from "react-icons/fi";

function Training() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const data = await api.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      console.error("Ошибка загрузки тренировок:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      await api.deleteWorkout(workoutId);
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    } catch (err) {
      console.error("Ошибка при удалении тренировки:", err);
    }
  };

  // Генерация массива дат (например, 15 дней назад и 15 дней вперёд)
  const generateDates = (center: Date, range: number = 3) => {
    const dates: Date[] = [];
    for (let i = -range; i <= range; i++) {
      const d = new Date(center);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const handlePrevDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const toggleWorkoutCompletion = async (workoutId: string) => {
    try {
      await api.completeWorkout(workoutId);
      setWorkouts(workouts.map(w =>
          w.id === workoutId ? { ...w, completed: !w.completed } : w
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const completeExerciseCompletion = async (workoutId: string, exerciseId: string) => {
    try {
      await api.completeExercise(workoutId, exerciseId);
      setWorkouts(workouts.map(w => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          exercises: w.exercises.map(e =>
              e.id === exerciseId ? { ...e, completed: !e.completed } : e
          )
        }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const completeSetCompletion = async (workoutId: string, exerciseId: string, setId: string) => {
    try {
      await api.completeSet(workoutId, exerciseId, setId);
      setWorkouts(workouts.map(w => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          exercises: w.exercises.map(e => {
            if (e.id !== exerciseId) return e;
            return {
              ...e,
              sets: e.sets.map(s =>
                  s.id === setId ? { ...s, completed: !s.completed } : s
              )
            }
          })
        }
      }));
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

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const filteredWorkouts = workouts.filter(w => w.date.split('T')[0] === selectedDateStr);

  const dates = generateDates(selectedDate);

  return (
      <div className="min-h-screen bg-gray-50 p-6 pb-20 flex flex-col">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Тренировки</h1>

        {/* Навигация по датам */}
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <button onClick={handlePrevDay} className="px-3 py-1 bg-gray-200 rounded">{"<"}</button>
          <div className="flex gap-2 overflow-x-auto">
            {dates.map(date => {
              const dateStr = date.toISOString().split('T')[0];
              return (
                  <button
                      key={dateStr}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-xl border ${
                          selectedDateStr === dateStr ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                      }`}
                  >
                    {date.getDate()}.{date.getMonth() + 1}
                  </button>
              );
            })}
          </div>
          <button onClick={handleNextDay} className="px-3 py-1 bg-gray-200 rounded">{">"}</button>
        </div>

        <div className="flex items-center mb-4">
          <button onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white rounded-full flex items-center justify-center px-2 py-2 ml-4 hover:bg-blue-600" > 
            <FiPlus className="text-xl mr-1 ml-1" />
            Добавить тренировку
          </button>
        </div>
        <CreateWorkoutModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            defaultDate={selectedDate}
            onWorkoutCreated={loadWorkouts}
        />

        <div className="flex-1 overflow-y-auto mb-40">
          {filteredWorkouts.length === 0 ? (
              <p className="text-center text-gray-600">Нет тренировок на выбранную дату</p>
          ) : (
              filteredWorkouts.map(workout => (
                  <div key={workout.id} className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-700">{workout.title}</h2>
                      <div className="flex">
                      <button
                          onClick={() => toggleWorkoutCompletion(workout.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                              workout.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                          }`}
                      >
                        {workout.completed ? 'Выполнено' : 'Не начато'}
                      </button>
                      <button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="bg-red-500 text-white rounded-full flex items-center justify-center px-3 py-1 ml-2 hover:bg-red-600"
                      >
                        Удалить
                      </button>
                      </div>
                    </div>
                    
  
                    {/* Упражнения с чекбоксами */}
                    <div className="space-y-3">
                      {workout.exercises.map((ex: WorkoutExercise) => (
                          <div key={ex.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                  type="checkbox"
                                  checked={!!ex.completed}
                                  onChange={() => completeExerciseCompletion(workout.id, ex.id)}
                              />
                              <p className="font-medium text-gray-900 text-lg">{ex.name}</p> {/* текст упражнения крупнее */}
                            </div>
  
                            {/* Подходы как дочерний список вправо */}
                            <div className="flex flex-col space-y-1 ml-4">
                              {ex.sets.map((s: WorkoutSet, idx) => (
                                  <div key={s.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={!!s.completed}
                                        onChange={() => completeSetCompletion(workout.id, ex.id, s.id)}
                                    />
                                    <span className="text-gray-800 text-base">
                {s.reps} повторений {s.weight ? `(${s.weight} кг)` : ''}
              </span>
                                  </div>
                              ))}
                            </div>
                          </div>
                      ))}
                    </div>
  
                  </div>
              ))
          )}
        </div>

        <div className="fixed bottom-24 left-0 w-full px-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Еженедельная аналитика от ИИ</h2>
            <p className="text-blue-100">Ваш прогресс анализируется искусственным интеллектом для персонализированных рекомендаций</p>
          </div>
        </div>
        
        <BottomNavigation />
      </div>
  );
}

export default Training;
