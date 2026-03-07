import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import Login from "@/pages/Login";
import Home from "@/pages/Home";
import CareerPredictor from "@/pages/CareerPredictor";
import ResumeValidator from "@/pages/ResumeValidator";
import JobRecommendations from "@/pages/JobRecommendations";
import Dashboard from "@/pages/Dashboard";

import Navbar from "@/components/Navbar";
import AIAssistant from "@/components/ui/AIAssistant";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
export const API = `${BACKEND_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: API,
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// ── Floating toggle shown only on login page (no navbar) ──
const LoginThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();
  return (
    <>
      <style>{`
        .login-theme-toggle {
          position: fixed; top: 20px; right: 24px; z-index: 999;
          width: 40px; height: 40px; border-radius: 12px;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        [data-theme="dark"] .login-theme-toggle {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fbbf24;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        [data-theme="dark"] .login-theme-toggle:hover {
          background: rgba(251,191,36,0.1);
          border-color: rgba(251,191,36,0.25);
          transform: scale(1.05);
        }
        [data-theme="light"] .login-theme-toggle {
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.1);
          color: #6e6e73;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        [data-theme="light"] .login-theme-toggle:hover {
          background: rgba(41,151,255,0.08);
          border-color: rgba(41,151,255,0.2);
          color: #2997ff;
          transform: scale(1.05);
        }
        .login-theme-icon {
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
      `}</style>
      <button
        className="login-theme-toggle"
        onClick={toggleTheme}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <span className="login-theme-icon">
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </span>
      </button>
    </>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  // Track data-theme so Toaster stays in sync
  const [toasterTheme, setToasterTheme] = useState(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme");
      setToasterTheme(theme === "light" ? "light" : "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Toaster
          position="top-right"
          theme={toasterTheme}
          richColors
          closeButton
        />

        {/* Full Navbar when logged in, small floating toggle on login screen */}
        {user ? (
          <Navbar user={user} onLogout={handleLogout} />
        ) : (
          <LoginThemeToggle />
        )}

        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-predictor"
            element={
              <ProtectedRoute>
                <CareerPredictor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-validator"
            element={
              <ProtectedRoute>
                <ResumeValidator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <JobRecommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {user && <AIAssistant />}
      </BrowserRouter>
    </div>
  );
}

export default App;
