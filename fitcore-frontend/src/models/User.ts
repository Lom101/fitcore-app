import {Workout} from "./Workout";
import {Measurement} from "./Measurement";
import {NutritionDay} from "./NutritionDay";

export interface User {
    id: string;                // Идентификатор пользователя
    email: string;             // Email для логина
    password: string;          // Пароль (не хэширован)
    username: string;          // Имя пользователя
    isPremium: boolean;        // Премиум-подписка
    createdAt: string;         // Дата создания аккаунта
    age?: number;              // Возраст
    heightCm?: number;         // Рост в см
    weightKg?: number;         // Вес в кг

    workouts: Workout[];       // Список тренировок
    measurements: Measurement[]; // Дневник прогресса
    nutritionDays: NutritionDay[]; // Дневник питания
}
