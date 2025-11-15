import {WorkoutExercise} from "./WorkoutExercise";

export interface Workout {
    id: string;                // Идентификатор тренировки
    userId: string;            // Владелец тренировки
    title: string;             // Название тренировки
    date: string;              // Дата тренировки
    completed: boolean;        // Выполнена ли тренировка
    durationMinutes: number;   // Длительность в минутах
    exercises: WorkoutExercise[]; // Упражнения в тренировке
}