export enum MealType {
    Breakfast = 0,
    Lunch = 1,
    Dinner = 2,
    Snacks = 3
}

export interface Meal {
    id: string;                // Идентификатор приема пищи
    nutritionDayId: string;    // День питания
    mealType: MealType;            // Тип приема пищи
    protein: number;           // Белки
    fat: number;               // Жиры
    carbs: number;             // Углеводы
}
