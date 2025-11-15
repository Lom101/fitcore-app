import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Training from "./pages/Training";
import Nutrition from "./pages/Nutrition";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import CoachPanel from "./pages/CoachPanel";
import MainPage from "./pages/MainPage";
import CoachChat from "./pages/CoachChat";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    return (
        <Router>
            <Routes>
                {!token ? (
                    <>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/*" element={<Navigate to="/auth" replace />} />
                        <Route path="/auth" element={<Auth setToken={setToken} />} />
                    </>
                ) : (
                    <>
                        <Route path="/*" element={<Navigate to="/" replace />} />
                        <Route path="/" element={<MainPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/training" element={<Training />} />
                        <Route path="/nutrition" element={<Nutrition />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/coach" element={<CoachPanel />} />
                        <Route path="/coach/chat" element={<CoachChat />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
