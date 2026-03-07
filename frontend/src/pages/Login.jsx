import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/App";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userInfoRes = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          },
        );
        if (!userInfoRes.ok) throw new Error("Failed to fetch Google profile");
        const userInfo = await userInfoRes.json();
        const response = await axiosInstance.post("/auth/google", {
          email: userInfo.email,
          name: userInfo.name,
          sub: userInfo.sub,
        });
        const token = response.data.access_token;
        const user = {
          name: response.data.user.name,
          email: response.data.user.email,
        };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        toast.success("Signed in with Google!");
        navigate("/");
      } catch (error) {
        const err = error?.response?.data?.detail;
        toast.error(err || "Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google sign-in was cancelled or failed."),
  });

  return (
    <>
      <style>{`
        /* ── Dark (default) ── */
        :root, [data-theme="dark"] {
          --lg-bg:                  #000000;
          --lg-glow-top:            rgba(41,151,255,0.1);
          --lg-glow-right:          rgba(90,200,250,0.05);
          --lg-card-bg:             rgba(255,255,255,0.03);
          --lg-card-border:         rgba(255,255,255,0.09);
          --lg-card-shadow:         0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
          --lg-input-bg:            rgba(255,255,255,0.04);
          --lg-input-border:        rgba(255,255,255,0.08);
          --lg-input-color:         #f5f5f7;
          --lg-input-placeholder:   #3a3a3c;
          --lg-input-focus-bg:      rgba(41,151,255,0.04);
          --lg-text-1:              #f5f5f7;
          --lg-text-2:              #a1a1a6;
          --lg-text-3:              #6e6e73;
          --lg-text-4:              #515154;
          --lg-tabs-bg:             rgba(255,255,255,0.04);
          --lg-tabs-border:         rgba(255,255,255,0.07);
          --lg-tab-inactive-color:  #6e6e73;
          --lg-tab-hover-bg:        rgba(255,255,255,0.05);
          --lg-divider:             rgba(255,255,255,0.06);
          --lg-sep-line:            rgba(255,255,255,0.07);
          --lg-google-bg:           rgba(255,255,255,0.04);
          --lg-google-border:       rgba(255,255,255,0.09);
          --lg-google-color:        #e5e5ea;
          --lg-google-hover-bg:     rgba(255,255,255,0.08);
          --lg-google-hover-border: rgba(255,255,255,0.16);
          --lg-google-spin-border:  rgba(255,255,255,0.12);
          --lg-google-spin-top:     #a1a1a6;
          --lg-eyebrow-bg:          rgba(41,151,255,0.1);
          --lg-eyebrow-border:      rgba(41,151,255,0.2);
          --lg-feature-color:       #a1a1a6;
          --lg-feature-check-bg:    rgba(41,151,255,0.1);
          --lg-feature-check-border:rgba(41,151,255,0.25);
        }

        /* ── Light ── */
        [data-theme="light"] {
          --lg-bg:                  #f5f7fa;
          --lg-glow-top:            rgba(41,151,255,0.06);
          --lg-glow-right:          rgba(59,130,246,0.04);
          --lg-card-bg:             #ffffff;
          --lg-card-border:         rgba(0,0,0,0.08);
          --lg-card-shadow:         0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
          --lg-input-bg:            #f8faff;
          --lg-input-border:        rgba(0,0,0,0.1);
          --lg-input-color:         #1e293b;
          --lg-input-placeholder:   #94a3b8;
          --lg-input-focus-bg:      rgba(41,151,255,0.03);
          --lg-text-1:              #1e293b;
          --lg-text-2:              #64748b;
          --lg-text-3:              #94a3b8;
          --lg-text-4:              #94a3b8;
          --lg-tabs-bg:             rgba(0,0,0,0.03);
          --lg-tabs-border:         rgba(0,0,0,0.07);
          --lg-tab-inactive-color:  #64748b;
          --lg-tab-hover-bg:        rgba(0,0,0,0.04);
          --lg-divider:             rgba(0,0,0,0.06);
          --lg-sep-line:            rgba(0,0,0,0.08);
          --lg-google-bg:           #f8faff;
          --lg-google-border:       rgba(0,0,0,0.1);
          --lg-google-color:        #1e293b;
          --lg-google-hover-bg:     #eef2f7;
          --lg-google-hover-border: rgba(0,0,0,0.15);
          --lg-google-spin-border:  rgba(0,0,0,0.1);
          --lg-google-spin-top:     #64748b;
          --lg-eyebrow-bg:          rgba(41,151,255,0.08);
          --lg-eyebrow-border:      rgba(41,151,255,0.18);
          --lg-feature-color:       #64748b;
          --lg-feature-check-bg:    rgba(41,151,255,0.08);
          --lg-feature-check-border:rgba(41,151,255,0.2);
        }

        .lg-root {
          min-height: 100vh;
          background: var(--lg-bg);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; position: relative; overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          transition: background 0.3s;
        }
        .lg-glow-top {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, var(--lg-glow-top) 0%, transparent 65%);
          pointer-events: none;
        }
        .lg-glow-right {
          position: absolute; bottom: -100px; right: -100px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, var(--lg-glow-right) 0%, transparent 65%);
          pointer-events: none;
        }

        @keyframes lgPageIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lgCardIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lgPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }
        @keyframes lgSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .lg-grid {
          position: relative; z-index: 10;
          width: 100%; max-width: 920px;
          display: grid; gap: 48px; align-items: center;
        }
        @media(min-width: 768px) { .lg-grid { grid-template-columns: 1fr 1fr; } }

        .lg-left { display: none; animation: lgPageIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both; }
        @media(min-width: 768px) { .lg-left { display: block; } }

        .lg-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; text-decoration: none; }
        .lg-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(41,151,255,0.35); flex-shrink: 0;
        }
        .lg-logo-name { font-size: 17px; font-weight: 700; color: var(--lg-text-1); letter-spacing: -0.02em; }
        .lg-logo-name span { background: linear-gradient(135deg, #2997ff, #5ac8fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .lg-headline { font-size: clamp(34px, 4.5vw, 50px); font-weight: 700; color: var(--lg-text-1); letter-spacing: -0.035em; line-height: 1.08; margin-bottom: 16px; }
        .lg-headline-accent { background: linear-gradient(135deg, #2997ff, #5ac8fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .lg-desc { color: var(--lg-text-3); font-size: 15px; line-height: 1.65; margin-bottom: 32px; max-width: 360px; }

        .lg-features { display: flex; flex-direction: column; gap: 12px; }
        .lg-feature { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--lg-feature-color); }
        .lg-feature-check {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: var(--lg-feature-check-bg); border: 1px solid var(--lg-feature-check-border);
          display: flex; align-items: center; justify-content: center;
        }

        .lg-card {
          background: var(--lg-card-bg);
          border: 1px solid var(--lg-card-border);
          border-radius: 24px; padding: 36px;
          backdrop-filter: blur(24px);
          box-shadow: var(--lg-card-shadow);
          animation: lgCardIn 0.6s 0.1s cubic-bezier(0.4, 0, 0.2, 1) both;
          transition: background 0.3s, border-color 0.3s;
        }

        .lg-card-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          background: var(--lg-eyebrow-bg); border: 1px solid var(--lg-eyebrow-border);
          color: #2997ff; font-size: 11px; font-weight: 500;
          letter-spacing: 0.02em; margin-bottom: 16px;
        }
        .lg-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #2997ff; animation: lgPulse 2.5s ease-in-out infinite; }
        .lg-card-title { font-size: 24px; font-weight: 700; color: var(--lg-text-1); letter-spacing: -0.02em; margin-bottom: 6px; }
        .lg-card-sub { color: var(--lg-text-3); font-size: 14px; margin-bottom: 28px; }

        .lg-tabs {
          display: flex; background: var(--lg-tabs-bg); border: 1px solid var(--lg-tabs-border);
          border-radius: 12px; padding: 4px; margin-bottom: 28px; gap: 4px;
        }
        .lg-tab {
          flex: 1; padding: 9px 12px; text-align: center; border-radius: 9px;
          font-size: 13px; font-weight: 500; cursor: pointer; border: none;
          transition: all 0.2s ease; font-family: inherit; letter-spacing: -0.01em;
        }
        .lg-tab-active { background: #2997ff; color: #ffffff; font-weight: 600; box-shadow: 0 2px 12px rgba(41,151,255,0.35); }
        .lg-tab-inactive { background: transparent; color: var(--lg-tab-inactive-color); }
        .lg-tab-inactive:hover { color: var(--lg-text-2); background: var(--lg-tab-hover-bg); }

        .lg-field { margin-bottom: 18px; }
        .lg-label { display: block; font-size: 11px; font-weight: 600; color: var(--lg-text-3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
        .lg-input {
          width: 100%; padding: 12px 16px; border-radius: 12px; font-size: 14px;
          background: var(--lg-input-bg); border: 1px solid var(--lg-input-border);
          color: var(--lg-input-color); outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit; box-sizing: border-box;
        }
        .lg-input::placeholder { color: var(--lg-input-placeholder); }
        .lg-input:focus { border-color: rgba(41,151,255,0.45); background: var(--lg-input-focus-bg); box-shadow: 0 0 0 3px rgba(41,151,255,0.1); }

        .lg-btn {
          width: 100%; padding: 14px; border-radius: 14px; border: none;
          font-size: 15px; font-weight: 600; cursor: pointer; background: #2997ff; color: #ffffff;
          font-family: inherit; letter-spacing: -0.01em; transition: all 0.25s ease; margin-top: 8px;
          position: relative; overflow: hidden;
        }
        .lg-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%); pointer-events: none; }
        .lg-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(41,151,255,0.4); background: #2484e0; }
        .lg-btn:active:not(:disabled) { transform: translateY(0); }
        .lg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .lg-divider { height: 1px; background: var(--lg-divider); margin: 4px 0 20px; }

        .lg-separator { display: flex; align-items: center; gap: 12px; margin: 20px 0 14px; }
        .lg-separator-line { flex: 1; height: 1px; background: var(--lg-sep-line); }
        .lg-separator-text { color: var(--lg-text-4); font-size: 12px; font-weight: 500; letter-spacing: 0.02em; white-space: nowrap; }

        .lg-google-btn {
          width: 100%; padding: 13px 16px; border-radius: 14px;
          border: 1px solid var(--lg-google-border); background: var(--lg-google-bg);
          color: var(--lg-google-color); font-size: 14px; font-weight: 500;
          font-family: inherit; letter-spacing: -0.01em; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.25s ease;
        }
        .lg-google-btn:hover:not(:disabled) { background: var(--lg-google-hover-bg); border-color: var(--lg-google-hover-border); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .lg-google-btn:active:not(:disabled) { transform: translateY(0); }
        .lg-google-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .lg-google-spinner {
          width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid var(--lg-google-spin-border); border-top-color: var(--lg-google-spin-top);
          animation: lgSpin 0.7s linear infinite;
        }
      `}</style>

      <div className="lg-root">
        <div className="lg-glow-top" />
        <div className="lg-glow-right" />

        <div className="lg-grid">
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
                <button
                  type="submit"
                  className="lg-btn"
                  disabled={loading || googleLoading}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            )}

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
                <button
                  type="submit"
                  className="lg-btn"
                  disabled={loading || googleLoading}
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </form>
            )}

            <div className="lg-separator">
              <div className="lg-separator-line" />
              <span className="lg-separator-text">or continue with</span>
              <div className="lg-separator-line" />
            </div>

            <button
              className="lg-google-btn"
              onClick={() => handleGoogleLogin()}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <>
                  <div className="lg-google-spinner" />
                  Connecting…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
