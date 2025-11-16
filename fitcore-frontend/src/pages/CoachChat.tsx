import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { sendMessageToServer, getNutritionPrompt } from "../services/gigachatApi"; // убедись, что импорт правильный
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const CoachChat: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Привет! Я ваш AI фитнес-коуч. Чем могу помочь?", isUser: false, timestamp: new Date() }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => scrollToBottom(), [messages]);

    useEffect(() => {
        const initialQuestion = (location.state as any)?.initialQuestion;
        if (initialQuestion) setInputMessage(initialQuestion);
    }, [location]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputMessage,
            isUser: true,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        const replyText = await sendMessageToServer(userMessage.text);

        const botMessage: Message = {
            id: Date.now() + 1,
            text: replyText,
            isUser: false,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNutritionAnalysis = async () => {
        setIsLoading(true);

        try {
            console.log("Запрос промта питания...");
            const prompt = await getNutritionPrompt();
            console.log("Промт получен:", prompt);

            const replyText = await sendMessageToServer(prompt);
            console.log("Ответ AI:", replyText);

            const botMessage: Message = {
                id: Date.now(),
                text: replyText,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
            scrollToBottom();
        } catch (err) {
            console.error("Ошибка при анализе питания:", err);
            const errorMessage: Message = {
                id: Date.now(),
                text: "Произошла ошибка при анализе питания. Попробуйте позже.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
            <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate('/coach')} className="text-gray-500 hover:text-gray-700">← Назад</button>
                    <h1 className="text-xl font-bold text-gray-800">AI Коуч</h1>
                    <div className="w-6"></div>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${m.isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'}`}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ node, ...props }) => <p className="whitespace-pre-line mb-2" {...props} />,
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-2" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc ml-6 my-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                }}
                            >
                                {m.text}
                            </ReactMarkdown>
                            <p className={`text-xs mt-2 ${m.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>

                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4 sticky bottom-20">
                <div className="flex space-x-2">
          <textarea
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Задайте вопрос..."
              className="flex-1 border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:border-blue-500"
              rows={1}
          />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-blue-500 text-white rounded-xl px-4 py-3 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        📤
                    </button>
                    <button
                        onClick={handleNutritionAnalysis}
                        disabled={isLoading}
                        className="bg-green-500 text-white rounded-xl px-4 py-3 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        🥗 Анализ питания
                    </button>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default CoachChat;
