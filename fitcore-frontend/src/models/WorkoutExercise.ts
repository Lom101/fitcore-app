import {WorkoutSet} from "./WorkoutSet";

export interface WorkoutExercise {
    id: string;                // Идентификатор упражнения
    workoutId: string;         // К какой тренировке относится
    name: string;              // Название упражнения
    completed: boolean;
    sets: WorkoutSet[];        // Список подходов
}