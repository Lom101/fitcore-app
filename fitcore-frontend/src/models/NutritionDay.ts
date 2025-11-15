import {Meal} from "./Meal";

export interface NutritionDay {
    id: string;                // Идентификатор дня питания
    userId: string;            // Пользователь
    date: string;              // Дата
    consumedCalories: number;  // Сколько съедено калорий
    targetCalories: number;    // Цель по калориям
    meals: Meal[];             // Приемы пищи
}
