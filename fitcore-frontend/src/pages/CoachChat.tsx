import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const ACCESS_TOKEN = '123=='; // Полученный через OAuth на основе Authorization Key

function CoachChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Привет, Алексей! Я ваш AI фитнес-коуч. Чем я могу вам помочь сегодня?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (location.state?.initialQuestion) {
      setInputMessage(location.state.initialQuestion);
    }
  }, [location]);

  const getAIResponse = async (userMessage: string) => {
    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { role: 'system', content: 'Ты фитнес-коуч' },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const aiText = await getAIResponse(userMessage.text);

    const aiMessage = {
      id: Date.now() + 1,
      text: aiText,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/coach')} className="text-gray-500 hover:text-gray-700">
              ← Назад
            </button>
            <h1 className="text-xl font-bold text-gray-800">AI Коуч</h1>
            <div className="w-6"></div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map(message => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${message.isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          </div>
        </div>

        <BottomNavigation />
      </div>
  );
}

export default CoachChat;
