import { api } from "./api"; 

// Отправка сообщения в GigaChat
export async function sendMessageToServer(message: string): Promise<string> {
    const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        throw new Error("Ошибка при отправке сообщения");
    }

    const data = await response.json();
    return data.reply;
}

// Формируем промт с данными питания
export async function getNutritionPrompt(): Promise<string> {
    // Берем все дни питания пользователя через твой API
    const nutritionDays = await api.getAllNutrition(); // должен вернуть NutritionDayDto[]

    // Формируем читаемый промт для AI
    const prompt = `
Ты — AI диетолог. Проанализируй питание пользователя.
Данные по дням:
${JSON.stringify(nutritionDays, null, 2)}

Сделай выводы по: 
- соблюдению калорийности 
- баланс белков, жиров, углеводов
- советы для улучшения рациона
`;

    return prompt;
}
