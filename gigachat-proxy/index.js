import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// HTTPS агент для игнорирования самоподписанных сертификатов
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// Кэш токена
let cachedToken = null;
let tokenExpiresAt = 0;

const BASIC_AUTH = process.env.GIGACHAT_BASIC_AUTH;
console.log(process.env.GIGACHAT_BASIC_AUTH);

// Получение Access Token
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiresAt) return cachedToken;

    try {
        const rqUID = uuidv4();
        const response = await axios.post(
            "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
            "scope=GIGACHAT_API_PERS",
            {
                headers: {
                    "Authorization": `Basic ${BASIC_AUTH}`,
                    "RqUID": rqUID,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                httpsAgent,
            }
        );

        const data = response.data;
        cachedToken = data.access_token;
        // expires_at приходит в миллисекундах или секундах — проверяем и нормализуем
        tokenExpiresAt = data.expires_at > 1e12 ? data.expires_at : data.expires_at * 1000;

        console.log("Access Token обновлён:", cachedToken.slice(0, 20) + "...");
        return cachedToken;
    } catch (err) {
        throw new Error(
            `Ошибка при получении токена: ${err.response ? JSON.stringify(err.response.data) : err.message}`
        );
    }
}

// Отправка сообщения модели
async function sendMessageToModel(message) {
    const token = await getAccessToken();
    const requestId = uuidv4();
    const clientId = uuidv4();

    try {
        const response = await axios.post(
            "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
            {
                model: "GigaChat-Pro-preview",
                messages: [
                    {
                        "role": "system",
                        "content": `
Ты — AI фитнес-тренер. Отвечай **только на вопросы о тренировках, питании, восстановлении и здоровье в контексте фитнеса**.
- Не отклоняйся от темы.
- Давай **краткие, понятные ответы**, не больше 150–200 слов.
- Если вопрос не про фитнес/питание, вежливо скажи, что не можешь ответить.
- Пиши дружелюбно и мотивирующе.
`
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                top_p: 0.9
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-Request-ID": requestId,
                    "X-Client-ID": clientId,
                    "X-Session-ID": uuidv4(),
                    "Content-Type": "application/json"
                },
                httpsAgent
            }
        );
        const messageData = response.data.choices[0]?.message;
        const replyText = messageData?.content || "Извините, я не получил ответа от AI.";

        console.log("Ответ от GigaChat:", replyText);

        return replyText;

    } catch (err) {
        throw new Error(
            `Ошибка при отправке сообщения: ${err.response ? JSON.stringify(err.response.data) : err.message}`
        );
    }
}

// Эндпоинт для чата
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Сообщение не передано" });

        const reply = await sendMessageToModel(message);
        res.json({ reply });
    } catch (err) {
        console.error("Ошибка в сервере:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
