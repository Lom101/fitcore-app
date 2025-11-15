export interface Measurement {
    id: string;                // Идентификатор замера
    userId: string;            // Пользователь
    date: string;              // Дата замера
    weightKg?: number;         // Вес в кг
    chestCm?: number;          // Обхват груди
    waistCm?: number;          // Обхват талии
    hipCm?: number;            // Обхват бедер
}