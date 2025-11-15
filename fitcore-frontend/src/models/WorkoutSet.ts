export interface WorkoutSet {
    id: string;                // Идентификатор подхода
    workoutExerciseId: string; // К какому упражнению относится
    reps: number;              // Количество повторений
    weight: number;            // Вес в кг
    completed: boolean;
}