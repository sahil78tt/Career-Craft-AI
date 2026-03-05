import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/App";
import { toast } from "sonner";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      const token = response.data.access_token;
      const user = { name: response.data.name, email: response.data.email };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const err = error?.response?.data?.detail;
      if (Array.isArray(err)) toast.error(err[0].msg);
      else toast.error(err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/auth/signup", signupData);
      toast.success("Account created successfully!");
      const loginResponse = await axiosInstance.post("/auth/login", {
        email: signupData.email,
        password: signupData.password,
      });
      const token = loginResponse.data.access_token;
      const user = {
        name: loginResponse.data.name,
        email: loginResponse.data.email,
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/");
    } catch (error) {
      const err = error?.response?.data?.detail;
      if (Array.isArray(err)) toast.error(err[0].msg);
      else toast.error(err || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .lg-root {
          min-height: 100vh;
          background: #000000;
          display: flex; align-items: center; justify-content: center;
          padding: 24px; position: relative; overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }
        .lg-glow-top {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(41,151,255,0.1) 0%, transparent 65%);
          pointer-events: none;
        }
        .lg-glow-right {
          position: absolute; bottom: -100px; right: -100px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(90,200,250,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        @keyframes lgPageIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lgCardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lgPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        .lg-grid {
          position: relative; z-index: 10;
          width: 100%; max-width: 920px;
          display: grid; gap: 48px; align-items: center;
        }
        @media(min-width: 768px) { .lg-grid { grid-template-columns: 1fr 1fr; } }

        /* Left panel */
        .lg-left {
          display: none;
          animation: lgPageIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @media(min-width: 768px) { .lg-left { display: block; } }

        .lg-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 32px;
          text-decoration: none;
        }
        .lg-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(41,151,255,0.35); flex-shrink: 0;
        }
        .lg-logo-name {
          font-size: 17px; font-weight: 700; color: #f5f5f7; letter-spacing: -0.02em;
        }
        .lg-logo-name span {
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lg-headline {
          font-size: clamp(34px, 4.5vw, 50px);
          font-weight: 700; color: #f5f5f7;
          letter-spacing: -0.035em; line-height: 1.08;
          margin-bottom: 16px;
        }
        .lg-headline-accent {
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lg-desc {
          color: #6e6e73; font-size: 15px; line-height: 1.65;
          margin-bottom: 32px; max-width: 360px;
        }

        .lg-features { display: flex; flex-direction: column; gap: 12px; }
        .lg-feature {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; color: #a1a1a6;
        }
        .lg-feature-check {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: rgba(41,151,255,0.1);
          border: 1px solid rgba(41,151,255,0.25);
          display: flex; align-items: center; justify-content: center;
        }

        /* Auth card */
        .lg-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px; padding: 36px;
          backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
          animation: lgCardIn 0.6s 0.1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .lg-card-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(41,151,255,0.1); border: 1px solid rgba(41,151,255,0.2);
          color: #2997ff; font-size: 11px; font-weight: 500;
          letter-spacing: 0.02em; margin-bottom: 16px;
        }
        .lg-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #2997ff;
          animation: lgPulse 2.5s ease-in-out infinite;
        }
        .lg-card-title {
          font-size: 24px; font-weight: 700; color: #f5f5f7;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .lg-card-sub { color: #6e6e73; font-size: 14px; margin-bottom: 28px; }

        .lg-tabs {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 4px;
          margin-bottom: 28px; gap: 4px;
        }
        .lg-tab {
          flex: 1; padding: 9px 12px; text-align: center; border-radius: 9px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          border: none; transition: all 0.2s ease; font-family: inherit;
          letter-spacing: -0.01em;
        }
        .lg-tab-active {
          background: #2997ff; color: #ffffff; font-weight: 600;
          box-shadow: 0 2px 12px rgba(41,151,255,0.35);
        }
        .lg-tab-inactive { background: transparent; color: #6e6e73; }
        .lg-tab-inactive:hover { color: #a1a1a6; background: rgba(255,255,255,0.05); }

        .lg-field { margin-bottom: 18px; }
        .lg-label {
          display: block; font-size: 11px; font-weight: 600; color: #6e6e73;
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px;
        }
        .lg-input {
          width: 100%; padding: 12px 16px; border-radius: 12px; font-size: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f5f5f7; outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit; box-sizing: border-box;
        }
        .lg-input::placeholder { color: #3a3a3c; }
        .lg-input:focus {
          border-color: rgba(41,151,255,0.45);
          background: rgba(41,151,255,0.04);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.1);
        }

        .lg-btn {
          width: 100%; padding: 14px; border-radius: 14px; border: none;
          font-size: 15px; font-weight: 600; cursor: pointer;
          background: #2997ff; color: #ffffff;
          font-family: inherit; letter-spacing: -0.01em;
          transition: all 0.25s ease; margin-top: 8px;
          position: relative; overflow: hidden;
        }
        .lg-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%);
          pointer-events: none;
        }
        .lg-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(41,151,255,0.4);
          background: #2484e0;
        }
        .lg-btn:active:not(:disabled) { transform: translateY(0); }
        .lg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .lg-divider {
          height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0 20px;
        }
      `}</style>

      <div className="lg-root">
        <div className="lg-glow-top" />
        <div className="lg-glow-right" />

        <div className="lg-grid">
          {/* Left panel */}
          <div className="lg-left">
            <div className="lg-logo">
              <div className="lg-logo-mark">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle cx="8" cy="8" r="2" fill="white" />
                </svg>
              </div>
              <div className="lg-logo-name">
                Career<span>Craft</span>
              </div>
            </div>

            <h1 className="lg-headline">
              Your Career,
              <br />
              <span className="lg-headline-accent">Reimagined</span>
            </h1>
            <p className="lg-desc">
              Predict career success, validate your resume, and discover
              personalized job recommendations powered by AI and Machine
              Learning.
            </p>

            <div className="lg-features">
              {[
                "ML-powered career success prediction",
                "NLP resume analysis & scoring",
                "Personalized job recommendations",
                "AI Career Advisor chatbot",
              ].map((f, i) => (
                <div key={i} className="lg-feature">
                  <div className="lg-feature-check">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5L4 7.5L8.5 2.5"
                        stroke="#2997ff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Auth card */}
          <div className="lg-card">
            <div className="lg-card-eyebrow">
              <span className="lg-eyebrow-dot" />
              AI-Powered Platform
            </div>
            <div className="lg-card-title">
              {tab === "login" ? "Welcome back" : "Create account"}
            </div>
            <div className="lg-card-sub">
              {tab === "login"
                ? "Sign in to continue your career journey"
                : "Join thousands building their future with AI"}
            </div>
            <div className="lg-divider" />

            {/* Tabs */}
            <div className="lg-tabs">
              <button
                className={`lg-tab ${tab === "login" ? "lg-tab-active" : "lg-tab-inactive"}`}
                onClick={() => setTab("login")}
              >
                Sign In
              </button>
              <button
                className={`lg-tab ${tab === "signup" ? "lg-tab-active" : "lg-tab-inactive"}`}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {tab === "login" && (
              <form onSubmit={handleLogin}>
                <div className="lg-field">
                  <label className="lg-label">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="lg-input"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="lg-field">
                  <label className="lg-label">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="lg-input"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="lg-btn" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {tab === "signup" && (
              <form onSubmit={handleSignup}>
                <div className="lg-field">
                  <label className="lg-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="lg-input"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="lg-field">
                  <label className="lg-label">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="lg-input"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="lg-field">
                  <label className="lg-label">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="lg-input"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="lg-btn" disabled={loading}>
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
