import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

type AuthProps = {
    setToken: (token: string) => void;
};
type Mode = "login" | "register";

function Auth({ setToken }: AuthProps) {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let token;
            if (mode === "login") {
                token = await api.login(email, password);
            } else {
                await api.register(email, password, username);
                token = await api.login(email, password);
            }
            localStorage.setItem("token", token);
            navigate("/dashboard", { replace: true });
            setToken(token); // обновляем состояние и маршруты
        } catch (err: any) {
            setError(err.response?.data || "Ошибка подключения к API");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {mode === "login" ? "Вход" : "Регистрация"}
                </h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3"
                        required
                    />

                    {mode === "register" && (
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl p-3"
                            required
                        />
                    )}

                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        {mode === "login" ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                    <span
                        className="text-blue-600 cursor-pointer font-semibold"
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                    >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </span>
                </p>
            </div>
        </div>
    );
}

export default Auth;
