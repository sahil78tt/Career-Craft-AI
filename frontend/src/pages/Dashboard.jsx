import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/App";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Award,
  Activity,
  Target,
  ChevronRight,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const ROLE_LABELS = {
  software_engineer: "Software Engineer",
  data_scientist: "Data Scientist",
  frontend_developer: "Frontend Developer",
  devops_engineer: "DevOps Engineer",
  ml_engineer: "ML Engineer",
  product_manager: "Product Manager",
  backend_developer: "Backend Developer",
};

const ALL_ROLES = Object.keys(ROLE_LABELS);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Progress tracker state
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("software_engineer");
  const [savingRole, setSavingRole] = useState(false);

  // Theme detection for recharts tooltip & loading state
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.getAttribute("data-theme") !== "light";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.getAttribute("data-theme") !== "light",
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchProgress();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axiosInstance.get("/dashboard");
      setAnalytics(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    setProgressLoading(true);
    try {
      const response = await axiosInstance.get("/user/progress");
      setProgress(response.data);
      setSelectedRole(response.data.target_role || "software_engineer");
    } catch (error) {
      setProgress(null);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleSaveRole = async () => {
    setSavingRole(true);
    try {
      await axiosInstance.put("/user/progress", { target_role: selectedRole });
      toast.success("Target role updated!");
      setShowRoleModal(false);
      fetchProgress();
    } catch (error) {
      toast.error("Failed to update target role");
    } finally {
      setSavingRole(false);
    }
  };

  const COLORS = ["#2997ff", "#5ac8fa", "#34d399", "#a78bfa", "#fbbf24"];

  if (loading)
    return (
      <>
        <style>{`
          @keyframes dbSpin { to { transform: rotate(360deg); } }
          :root, [data-theme="dark"] { --db-bg: #000000; --db-text-3: #6e6e73; --db-blue: #2997ff; }
          [data-theme="light"]       { --db-bg: #f5f7fa; --db-text-3: #94a3b8; --db-blue: #2997ff; }
          .db-loading-root {
            min-height: 100vh;
            background: var(--db-bg);
            display: flex; align-items: center; justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
          }
          .db-loading-icon {
            width: 52px; height: 52px; border-radius: 16px;
            background: rgba(41,151,255,0.1); border: 1px solid rgba(41,151,255,0.2);
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 16px;
          }
          .db-loading-spinner {
            width: 20px; height: 20px;
            border: 2px solid var(--db-blue); border-top-color: transparent;
            border-radius: 50%; animation: dbSpin 0.8s linear infinite;
          }
          .db-loading-text { color: var(--db-text-3); font-size: 13px; font-weight: 500; text-align: center; }
        `}</style>
        <div className="db-loading-root">
          <div>
            <div className="db-loading-icon">
              <div className="db-loading-spinner" />
            </div>
            <p className="db-loading-text">Loading your dashboard…</p>
          </div>
        </div>
      </>
    );

  const metrics = [
    {
      label: "Predictions Made",
      value: progress?.total_predictions ?? analytics?.predictions_made ?? 0,
      icon: TrendingUp,
      color: "#34d399",
      accent: "52,211,153",
      badge: "+3 this week",
      testid: "predictions-stat",
    },
    {
      label: "Resumes Analyzed",
      value: progress?.total_resumes ?? analytics?.resumes_analyzed ?? 0,
      icon: Activity,
      color: "#2997ff",
      accent: "41,151,255",
      badge: "NLP powered",
      testid: "analyses-stat",
    },
    {
      label: "User Level",
      value: analytics?.user_level,
      icon: Target,
      color: "#fbbf24",
      accent: "251,191,36",
      badge: "Keep going!",
      testid: "level-stat",
    },
    {
      label: "Badges Earned",
      value: progress?.badges?.length ?? analytics?.badges?.length ?? 0,
      icon: Award,
      color: "#a78bfa",
      accent: "167,139,250",
      badge: "Top 20%",
      testid: "badges-stat",
    },
  ];

  const tooltipStyle = {
    background: isDark ? "#111111" : "#ffffff",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.1)",
    borderRadius: "14px",
    color: isDark ? "#f5f5f7" : "#1e293b",
    fontSize: "12px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    boxShadow: isDark
      ? "0 20px 60px rgba(0,0,0,0.6)"
      : "0 20px 60px rgba(0,0,0,0.15)",
    padding: "10px 14px",
  };

  const completionPct = progress?.completion_pct ?? 0;
  const skillsHave = progress?.skills_have ?? [];
  const skillsMissing = progress?.skills_missing ?? [];
  const resumeScore = progress?.resume_score;

  return (
    <>
      <style>{`
        /* ── Dark (default) ── */
        :root, [data-theme="dark"] {
          --db-bg:                    #000000;
          --db-bg-1:                  #0a0a0a;
          --db-bg-2:                  #111111;
          --db-bg-3:                  #1a1a1a;
          --db-border:                rgba(255,255,255,0.08);
          --db-border2:               rgba(255,255,255,0.14);
          --db-text-1:                #f5f5f7;
          --db-text-2:                #a1a1a6;
          --db-text-3:                #6e6e73;
          --db-text-4:                #3a3a3c;
          --db-blue:                  #2997ff;
          --db-blue-dim:              rgba(41,151,255,0.1);
          --db-surface:               rgba(255,255,255,0.03);
          --db-surface2:              rgba(255,255,255,0.05);
          --db-divider:               rgba(255,255,255,0.06);
          --db-glow:                  rgba(41,151,255,0.07);
          --db-glow-right:            rgba(90,200,250,0.04);
          --db-eyebrow-bg:            rgba(41,151,255,0.1);
          --db-eyebrow-border:        rgba(41,151,255,0.2);
          --db-live-bg:               rgba(52,211,153,0.08);
          --db-live-border:           rgba(52,211,153,0.2);
          --db-live-color:            #34d399;
          --db-tag-bg:                rgba(41,151,255,0.08);
          --db-tag-border:            rgba(41,151,255,0.18);
          --db-tag-color:             #5ac8fa;
          --db-badge-chip-bg:         rgba(251,191,36,0.07);
          --db-badge-chip-border:     rgba(251,191,36,0.18);
          --db-badge-more-bg:         rgba(255,255,255,0.02);
          --db-badge-more-border:     rgba(255,255,255,0.1);
          --db-badge-more-color:      #3a3a3c;
          --db-sh-sm:                 0 2px 12px rgba(0,0,0,0.4);
          --db-sh-md:                 0 8px 40px rgba(0,0,0,0.3);
          --db-sh-lg:                 0 20px 60px rgba(0,0,0,0.4);
          --db-metric-hover-shadow:   0 20px 60px rgba(0,0,0,0.4);
          --db-panel-hover-shadow:    0 8px 40px rgba(0,0,0,0.3);
          /* progress tracker */
          --db-role-card-bg:          rgba(41,151,255,0.05);
          --db-role-card-border:      rgba(41,151,255,0.15);
          --db-ring-card-bg:          rgba(255,255,255,0.03);
          --db-ring-card-border:      rgba(255,255,255,0.08);
          --db-ring-track:            rgba(255,255,255,0.06);
          --db-score-card-bg:         rgba(255,255,255,0.03);
          --db-score-card-border:     rgba(255,255,255,0.08);
          --db-score-bar-track:       rgba(255,255,255,0.06);
          --db-score-empty-color:     #3a3a3c;
          --db-skill-have-bg:         rgba(52,211,153,0.08);
          --db-skill-have-border:     rgba(52,211,153,0.2);
          --db-skill-have-color:      #34d399;
          --db-skill-miss-bg:         rgba(255,159,10,0.08);
          --db-skill-miss-border:     rgba(255,159,10,0.2);
          --db-skill-miss-color:      #ff9f0a;
          --db-pred-bg:               rgba(167,139,250,0.05);
          --db-pred-border:           rgba(167,139,250,0.15);
          --db-pred-role-color:       #f5f5f7;
          --db-pred-score-color:      #a78bfa;
          --db-action-sec-bg:         rgba(255,255,255,0.05);
          --db-action-sec-color:      #a1a1a6;
          --db-action-sec-border:     rgba(255,255,255,0.09);
          --db-action-sec-hover-bg:   rgba(255,255,255,0.09);
          --db-action-sec-hover-col:  #f5f5f7;
          --db-action-sec-hover-bdr:  rgba(255,255,255,0.15);
          --db-modal-bg:              #111111;
          --db-modal-border:          rgba(255,255,255,0.1);
          --db-modal-shadow:          0 40px 100px rgba(0,0,0,0.6);
          --db-modal-overlay:         rgba(0,0,0,0.7);
          --db-role-opt-bg:           rgba(255,255,255,0.03);
          --db-role-opt-border:       rgba(255,255,255,0.08);
          --db-role-opt-color:        #a1a1a6;
          --db-role-opt-hover-bdr:    rgba(255,255,255,0.15);
          --db-role-opt-hover-col:    #f5f5f7;
          --db-spinner-bdr:           rgba(255,255,255,0.1);
          --db-spinner-color:         #6e6e73;
          --db-skills-track-bg:       rgba(255,255,255,0.06);
          --db-cart-grid-stroke:      rgba(255,255,255,0.04);
          --db-chart-label-color:     #6e6e73;
          --db-chart-cursor:          rgba(41,151,255,0.05);
          --db-chart-label-stroke:    rgba(255,255,255,0.08);
        }

        /* ── Light ── */
        [data-theme="light"] {
          --db-bg:                    #f5f7fa;
          --db-bg-1:                  #ffffff;
          --db-bg-2:                  #f0f4f8;
          --db-bg-3:                  #eef2f7;
          --db-border:                rgba(0,0,0,0.08);
          --db-border2:               rgba(0,0,0,0.13);
          --db-text-1:                #1e293b;
          --db-text-2:                #64748b;
          --db-text-3:                #94a3b8;
          --db-text-4:                #94a3b8;
          --db-blue:                  #2997ff;
          --db-blue-dim:              rgba(41,151,255,0.1);
          --db-surface:               rgba(0,0,0,0.02);
          --db-surface2:              rgba(0,0,0,0.04);
          --db-divider:               rgba(0,0,0,0.07);
          --db-glow:                  rgba(41,151,255,0.05);
          --db-glow-right:            rgba(41,151,255,0.03);
          --db-eyebrow-bg:            rgba(41,151,255,0.08);
          --db-eyebrow-border:        rgba(41,151,255,0.18);
          --db-live-bg:               rgba(34,197,94,0.08);
          --db-live-border:           rgba(34,197,94,0.2);
          --db-live-color:            #22c55e;
          --db-tag-bg:                rgba(41,151,255,0.08);
          --db-tag-border:            rgba(41,151,255,0.18);
          --db-tag-color:             #2997ff;
          --db-badge-chip-bg:         rgba(245,158,11,0.07);
          --db-badge-chip-border:     rgba(245,158,11,0.18);
          --db-badge-more-bg:         rgba(0,0,0,0.02);
          --db-badge-more-border:     rgba(0,0,0,0.1);
          --db-badge-more-color:      #94a3b8;
          --db-sh-sm:                 0 2px 12px rgba(0,0,0,0.06);
          --db-sh-md:                 0 8px 40px rgba(0,0,0,0.08);
          --db-sh-lg:                 0 20px 60px rgba(0,0,0,0.1);
          --db-metric-hover-shadow:   0 20px 60px rgba(0,0,0,0.12);
          --db-panel-hover-shadow:    0 8px 40px rgba(0,0,0,0.1);
          /* progress tracker */
          --db-role-card-bg:          rgba(41,151,255,0.05);
          --db-role-card-border:      rgba(41,151,255,0.15);
          --db-ring-card-bg:          rgba(0,0,0,0.02);
          --db-ring-card-border:      rgba(0,0,0,0.08);
          --db-ring-track:            rgba(0,0,0,0.07);
          --db-score-card-bg:         rgba(0,0,0,0.02);
          --db-score-card-border:     rgba(0,0,0,0.08);
          --db-score-bar-track:       rgba(0,0,0,0.07);
          --db-score-empty-color:     #94a3b8;
          --db-skill-have-bg:         rgba(34,197,94,0.08);
          --db-skill-have-border:     rgba(34,197,94,0.2);
          --db-skill-have-color:      #22c55e;
          --db-skill-miss-bg:         rgba(245,158,11,0.08);
          --db-skill-miss-border:     rgba(245,158,11,0.2);
          --db-skill-miss-color:      #f59e0b;
          --db-pred-bg:               rgba(168,85,247,0.05);
          --db-pred-border:           rgba(168,85,247,0.15);
          --db-pred-role-color:       #1e293b;
          --db-pred-score-color:      #a855f7;
          --db-action-sec-bg:         rgba(0,0,0,0.03);
          --db-action-sec-color:      #64748b;
          --db-action-sec-border:     rgba(0,0,0,0.08);
          --db-action-sec-hover-bg:   rgba(0,0,0,0.06);
          --db-action-sec-hover-col:  #1e293b;
          --db-action-sec-hover-bdr:  rgba(0,0,0,0.15);
          --db-modal-bg:              #ffffff;
          --db-modal-border:          rgba(0,0,0,0.1);
          --db-modal-shadow:          0 40px 100px rgba(0,0,0,0.15);
          --db-modal-overlay:         rgba(0,0,0,0.4);
          --db-role-opt-bg:           rgba(0,0,0,0.02);
          --db-role-opt-border:       rgba(0,0,0,0.08);
          --db-role-opt-color:        #64748b;
          --db-role-opt-hover-bdr:    rgba(0,0,0,0.15);
          --db-role-opt-hover-col:    #1e293b;
          --db-spinner-bdr:           rgba(0,0,0,0.1);
          --db-spinner-color:         #94a3b8;
          --db-skills-track-bg:       rgba(0,0,0,0.07);
          --db-cart-grid-stroke:      rgba(0,0,0,0.05);
          --db-chart-label-color:     #94a3b8;
          --db-chart-cursor:          rgba(41,151,255,0.05);
          --db-chart-label-stroke:    rgba(0,0,0,0.08);
        }

        .db-root {
          min-height: 100vh;
          background: var(--db-bg);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          padding: 100px 40px 80px;
          position: relative; overflow: hidden;
          color: var(--db-text-1);
        }
        @media(max-width: 768px) { .db-root { padding: 100px 20px 60px; } }

        .db-glow-top {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 1000px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, var(--db-glow) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .db-glow-right {
          position: fixed; top: 20%; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, var(--db-glow-right) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .db-inner {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto;
        }

        /* Header */
        .db-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px; flex-wrap: wrap; gap: 16px;
        }
        .db-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 999px;
          background: var(--db-eyebrow-bg); border: 1px solid var(--db-eyebrow-border);
          color: var(--db-blue); font-size: 12px; font-weight: 500;
          letter-spacing: 0.02em; margin-bottom: 16px;
        }
        .db-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--db-blue);
          animation: dbPulse 2.5s ease-in-out infinite;
        }
        @keyframes dbPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
        .db-title {
          font-size: clamp(30px, 4vw, 48px); font-weight: 700; color: var(--db-text-1);
          letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 10px;
        }
        .db-title-accent {
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .db-subtitle { color: var(--db-text-3); font-size: 16px; }
        .db-live-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 999px;
          background: var(--db-live-bg); border: 1px solid var(--db-live-border);
          font-size: 12px; font-weight: 600; color: var(--db-live-color);
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .db-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--db-live-color);
          animation: dbPulse 2s ease-in-out infinite;
        }

        /* Metric Cards */
        .db-metrics {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        @media(min-width: 1024px) { .db-metrics { grid-template-columns: repeat(4, 1fr); } }

        .db-metric {
          background: var(--db-surface); border: 1px solid var(--db-border);
          border-radius: 20px; padding: 24px; position: relative; overflow: hidden;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          cursor: default; backdrop-filter: blur(20px);
        }
        .db-metric:hover {
          border-color: var(--db-border2); transform: translateY(-4px);
          box-shadow: var(--db-metric-hover-shadow);
        }
        .db-metric-bar { position: absolute; top: 0; left: 0; right: 0; height: 1px; border-radius: 20px 20px 0 0; }
        .db-metric-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
        .db-metric-icon {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .db-metric-badge {
          font-size: 10px; letter-spacing: 0.03em;
          padding: 4px 10px; border-radius: 999px; font-weight: 500; white-space: nowrap;
        }
        .db-metric-val { font-size: 40px; font-weight: 700; line-height: 1; margin-bottom: 6px; letter-spacing: -0.04em; }
        .db-metric-lbl { color: var(--db-text-3); font-size: 12px; font-weight: 500; }

        /* Panel */
        .db-panel {
          background: var(--db-surface); border: 1px solid var(--db-border);
          border-radius: 20px; padding: 28px; backdrop-filter: blur(20px);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .db-panel:hover { border-color: var(--db-border2); box-shadow: var(--db-panel-hover-shadow); }
        .db-panel-head {
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
        }
        .db-panel-title { font-size: 16px; font-weight: 600; color: var(--db-text-1); letter-spacing: -0.01em; margin-bottom: 4px; }
        .db-panel-sub { font-size: 13px; color: var(--db-text-3); }
        .db-panel-tag {
          font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 999px;
          background: var(--db-tag-bg); border: 1px solid var(--db-tag-border);
          color: var(--db-tag-color); font-weight: 600;
        }
        .db-divider { height: 1px; background: var(--db-divider); margin-bottom: 20px; }

        /* Charts */
        .db-charts { display: grid; gap: 20px; margin-bottom: 20px; }
        @media(min-width: 1024px) { .db-charts { grid-template-columns: 3fr 2fr; } }

        /* Skills detail */
        .db-skill-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .db-skill-num {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .db-skill-name { color: var(--db-text-1); font-size: 13px; font-weight: 500; flex: 1; }
        .db-skill-pct { font-size: 11px; color: var(--db-text-3); width: 34px; text-align: right; flex-shrink: 0; }
        .db-skill-track { height: 5px; background: var(--db-skills-track-bg); border-radius: 999px; flex: 1; overflow: hidden; min-width: 120px; }
        .db-skill-fill { height: 100%; border-radius: 999px; transition: width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

        /* Badges */
        .db-badge-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 999px;
          background: var(--db-badge-chip-bg); border: 1px solid var(--db-badge-chip-border);
          margin-right: 8px; margin-bottom: 8px;
          transition: all 0.2s; cursor: default;
        }
        .db-badge-chip:hover { transform: translateY(-1px); }
        .db-badge-text { font-size: 13px; color: #fbbf24; font-weight: 600; }
        .db-badge-more {
          display: inline-flex; align-items: center;
          padding: 8px 16px; border-radius: 999px;
          background: var(--db-badge-more-bg); border: 1px dashed var(--db-badge-more-border); margin-bottom: 8px;
        }
        .db-badge-more-text { font-size: 13px; color: var(--db-badge-more-color); }

        /* ── Progress Tracker ── */
        @keyframes dbSpin { to { transform: rotate(360deg); } }

        .pt-section { margin-bottom: 24px; }

        .pt-top { display: grid; gap: 16px; margin-bottom: 16px; }
        @media(min-width: 900px)  { .pt-top { grid-template-columns: 1fr 1fr; } }
        @media(min-width: 1200px) { .pt-top { grid-template-columns: 1fr 1fr 1fr; } }

        /* Role card */
        .pt-role-card {
          background: var(--db-role-card-bg); border: 1px solid var(--db-role-card-border);
          border-radius: 16px; padding: 20px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .pt-role-label { font-size: 11px; font-weight: 600; color: var(--db-text-3); text-transform: uppercase; letter-spacing: 0.07em; }
        .pt-role-value { font-size: 18px; font-weight: 700; color: var(--db-text-1); letter-spacing: -0.02em; }
        .pt-role-change {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 999px; cursor: pointer;
          background: var(--db-eyebrow-bg); border: 1px solid var(--db-eyebrow-border);
          color: var(--db-blue); font-size: 12px; font-weight: 500;
          font-family: inherit; transition: all 0.2s;
        }
        .pt-role-change:hover { background: rgba(41,151,255,0.18); }

        /* Progress ring card */
        .pt-ring-card {
          background: var(--db-ring-card-bg); border: 1px solid var(--db-ring-card-border);
          border-radius: 16px; padding: 20px;
          display: flex; align-items: center; gap: 20px;
        }
        .pt-ring-wrap { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
        .pt-ring-svg { transform: rotate(-90deg); }
        .pt-ring-bg { fill: none; stroke: var(--db-ring-track); stroke-width: 6; }
        .pt-ring-fill {
          fill: none; stroke-width: 6; stroke-linecap: round;
          transition: stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .pt-ring-text {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: var(--db-text-1);
        }
        .pt-ring-info-title { font-size: 15px; font-weight: 600; color: var(--db-text-1); margin-bottom: 4px; }
        .pt-ring-info-sub { font-size: 13px; color: var(--db-text-3); }

        /* Resume score card */
        .pt-score-card {
          background: var(--db-score-card-bg); border: 1px solid var(--db-score-card-border);
          border-radius: 16px; padding: 20px;
        }
        .pt-score-label { font-size: 11px; font-weight: 600; color: var(--db-text-3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px; }
        .pt-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .pt-score-num { font-size: 36px; font-weight: 700; letter-spacing: -0.04em; }
        .pt-score-bar-track { height: 6px; background: var(--db-score-bar-track); border-radius: 999px; overflow: hidden; margin-bottom: 8px; }
        .pt-score-bar-fill { height: 100%; border-radius: 999px; transition: width 1.4s cubic-bezier(0.34,1.56,0.64,1); }
        .pt-score-feedback { font-size: 12px; color: var(--db-text-3); }
        .pt-score-empty { font-size: 13px; color: var(--db-score-empty-color); }
        .pt-score-action {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 10px; font-size: 12px; font-weight: 500; color: var(--db-blue);
          cursor: pointer; background: none; border: none; padding: 0;
          font-family: inherit; transition: opacity 0.2s;
        }
        .pt-score-action:hover { opacity: 0.7; }

        /* Skills grid */
        .pt-skills-grid { display: grid; gap: 16px; }
        @media(min-width: 900px) { .pt-skills-grid { grid-template-columns: 1fr 1fr; } }

        .pt-skills-col-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; margin-bottom: 12px;
          display: flex; align-items: center; gap: 6px;
        }
        .pt-skill-tag {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 8px; margin: 3px;
          font-size: 12px; font-weight: 500;
        }
        .pt-skill-have {
          background: var(--db-skill-have-bg);
          border: 1px solid var(--db-skill-have-border);
          color: var(--db-skill-have-color);
        }
        .pt-skill-miss {
          background: var(--db-skill-miss-bg);
          border: 1px solid var(--db-skill-miss-border);
          color: var(--db-skill-miss-color);
        }

        /* Quick actions */
        .pt-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .pt-action-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 999px; border: none; cursor: pointer;
          font-size: 13px; font-weight: 500; font-family: inherit; letter-spacing: -0.01em;
          transition: all 0.22s;
        }
        .pt-action-primary {
          background: #2997ff; color: #fff;
          box-shadow: 0 4px 20px rgba(41,151,255,0.25);
        }
        .pt-action-primary:hover { background: #2484e0; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(41,151,255,0.35); }
        .pt-action-secondary {
          background: var(--db-action-sec-bg);
          color: var(--db-action-sec-color);
          border: 1px solid var(--db-action-sec-border);
        }
        .pt-action-secondary:hover {
          background: var(--db-action-sec-hover-bg);
          color: var(--db-action-sec-hover-col);
          border-color: var(--db-action-sec-hover-bdr);
        }

        /* Prediction card */
        .pt-pred-card {
          background: var(--db-pred-bg); border: 1px solid var(--db-pred-border);
          border-radius: 16px; padding: 20px;
        }
        .pt-pred-label { font-size: 11px; font-weight: 600; color: var(--db-text-3); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
        .pt-pred-role { font-size: 17px; font-weight: 700; color: var(--db-pred-role-color); letter-spacing: -0.02em; margin-bottom: 6px; }
        .pt-pred-score { font-size: 13px; color: var(--db-pred-score-color); font-weight: 500; }

        /* Achievements label */
        .pt-achievements-label {
          font-size: 11px; font-weight: 600; color: var(--db-text-3);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 10px;
        }

        /* Modal */
        .pt-modal-overlay {
          position: fixed; inset: 0; background: var(--db-modal-overlay);
          backdrop-filter: blur(8px); z-index: 999;
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .pt-modal {
          background: var(--db-modal-bg); border: 1px solid var(--db-modal-border);
          border-radius: 24px; padding: 32px; width: 100%; max-width: 460px;
          box-shadow: var(--db-modal-shadow);
          animation: dbModalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes dbModalIn { from { opacity:0; transform:scale(0.92) translateY(16px); } to { opacity:1; transform:none; } }
        .pt-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
        .pt-modal-title { font-size: 18px; font-weight: 700; color: var(--db-text-1); letter-spacing: -0.02em; }
        .pt-modal-close { background: none; border: none; color: var(--db-text-3); cursor: pointer; padding: 4px; transition: color 0.2s; }
        .pt-modal-close:hover { color: var(--db-text-1); }
        .pt-roles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px; }
        .pt-role-option {
          padding: 12px 14px; border-radius: 12px;
          border: 1px solid var(--db-role-opt-border);
          background: var(--db-role-opt-bg); color: var(--db-role-opt-color);
          font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: inherit; text-align: center; transition: all 0.2s;
        }
        .pt-role-option.active {
          background: var(--db-blue-dim); border-color: rgba(41,151,255,0.3); color: var(--db-blue);
        }
        .pt-role-option:hover:not(.active) {
          border-color: var(--db-role-opt-hover-bdr); color: var(--db-role-opt-hover-col);
        }
        .pt-modal-save {
          width: 100%; padding: 13px; border-radius: 14px; border: none;
          background: #2997ff; color: #fff; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
        }
        .pt-modal-save:hover:not(:disabled) { background: #2484e0; transform: translateY(-1px); }
        .pt-modal-save:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Spinner */
        .pt-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid var(--db-spinner-bdr); border-top-color: var(--db-spinner-color);
          animation: dbSpin 0.7s linear infinite;
        }
      `}</style>

      <div className="db-root">
        <div className="db-glow-top" />
        <div className="db-glow-right" />

        <div className="db-inner">
          {/* Header */}
          <div className="db-header">
            <div>
              <div className="db-eyebrow">
                <span className="db-eyebrow-dot" />
                Analytics Overview
              </div>
              <h1 className="db-title">
                Career <span className="db-title-accent">Dashboard</span>
              </h1>
              <p className="db-subtitle">
                Your career intelligence at a glance
              </p>
            </div>
            <div className="db-live-pill">
              <span className="db-live-dot" />
              Live Data
            </div>
          </div>

          {/* Metric Cards */}
          <div className="db-metrics" data-testid="dashboard-page">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="db-metric" data-testid={m.testid}>
                  <div
                    className="db-metric-bar"
                    style={{
                      background: `linear-gradient(90deg, rgba(${m.accent},0.8), transparent)`,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 20,
                      pointerEvents: "none",
                      background: `radial-gradient(circle at 20% 0%, rgba(${m.accent},0.08), transparent 60%)`,
                    }}
                  />
                  <div className="db-metric-top">
                    <div
                      className="db-metric-icon"
                      style={{
                        background: `rgba(${m.accent},0.1)`,
                        border: `1px solid rgba(${m.accent},0.2)`,
                      }}
                    >
                      <Icon size={17} color={m.color} />
                    </div>
                    <span
                      className="db-metric-badge"
                      style={{
                        background: `rgba(${m.accent},0.08)`,
                        border: `1px solid rgba(${m.accent},0.2)`,
                        color: m.color,
                      }}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <div className="db-metric-val" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="db-metric-lbl">{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* ── Career Progress Tracker ── */}
          <div className="db-panel pt-section" style={{ marginBottom: 24 }}>
            <div className="db-panel-head">
              <div>
                <div className="db-panel-title">🎯 Career Progress Tracker</div>
                <div className="db-panel-sub">
                  Your personal roadmap to{" "}
                  {ROLE_LABELS[progress?.target_role] || "your goal"}
                </div>
              </div>
              <span className="db-panel-tag">Personal</span>
            </div>
            <div className="db-divider" />

            {progressLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "32px 0",
                }}
              >
                <div className="pt-spinner" />
              </div>
            ) : (
              <>
                {/* Top row — Role + Ring + Resume Score */}
                <div className="pt-top">
                  {/* Target Role */}
                  <div className="pt-role-card">
                    <div className="pt-role-label">Target Role</div>
                    <div className="pt-role-value">
                      {ROLE_LABELS[progress?.target_role] ||
                        "Software Engineer"}
                    </div>
                    <button
                      className="pt-role-change"
                      onClick={() => setShowRoleModal(true)}
                    >
                      <Target size={12} /> Change Goal
                    </button>
                  </div>

                  {/* Skill Completion Ring */}
                  <div className="pt-ring-card">
                    <div className="pt-ring-wrap">
                      <svg
                        className="pt-ring-svg"
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                      >
                        <circle className="pt-ring-bg" cx="40" cy="40" r="32" />
                        <circle
                          className="pt-ring-fill"
                          cx="40"
                          cy="40"
                          r="32"
                          stroke={
                            completionPct >= 80
                              ? "#34d399"
                              : completionPct >= 50
                                ? "#2997ff"
                                : "#fbbf24"
                          }
                          strokeDasharray={`${2 * Math.PI * 32}`}
                          strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionPct / 100)}`}
                        />
                      </svg>
                      <div className="pt-ring-text">{completionPct}%</div>
                    </div>
                    <div>
                      <div className="pt-ring-info-title">
                        Skills Completion
                      </div>
                      <div className="pt-ring-info-sub">
                        {skillsHave.length} of{" "}
                        {(progress?.required_skills ?? []).length} required
                        skills
                      </div>
                      {skillsMissing.length > 0 && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--db-skill-miss-color)",
                            marginTop: 6,
                          }}
                        >
                          {skillsMissing.length} skill
                          {skillsMissing.length > 1 ? "s" : ""} to learn
                        </div>
                      )}
                      {skillsMissing.length === 0 && skillsHave.length > 0 && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--db-skill-have-color)",
                            marginTop: 6,
                          }}
                        >
                          ✓ All skills covered!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resume Score */}
                  <div className="pt-score-card">
                    <div className="pt-score-label">Last Resume Score</div>
                    {resumeScore !== null && resumeScore !== undefined ? (
                      <>
                        <div className="pt-score-row">
                          <div
                            className="pt-score-num"
                            style={{
                              color:
                                resumeScore >= 70
                                  ? "#34d399"
                                  : resumeScore >= 50
                                    ? "#fbbf24"
                                    : "#ff453a",
                            }}
                          >
                            {resumeScore}
                          </div>
                          <div
                            style={{ fontSize: 13, color: "var(--db-text-3)" }}
                          >
                            /100
                          </div>
                        </div>
                        <div className="pt-score-bar-track">
                          <div
                            className="pt-score-bar-fill"
                            style={{
                              width: `${resumeScore}%`,
                              background:
                                resumeScore >= 70
                                  ? "linear-gradient(90deg,#34d399,#30c060)"
                                  : resumeScore >= 50
                                    ? "linear-gradient(90deg,#fbbf24,#f59e0b)"
                                    : "linear-gradient(90deg,#ff453a,#d63031)",
                            }}
                          />
                        </div>
                        <div className="pt-score-feedback">
                          {progress?.resume_feedback || ""}
                        </div>
                        <button
                          className="pt-score-action"
                          onClick={() => navigate("/resume-validator")}
                        >
                          Improve Score <ChevronRight size={12} />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="pt-score-empty">
                          No resume analyzed yet
                        </div>
                        <button
                          className="pt-score-action"
                          onClick={() => navigate("/resume-validator")}
                        >
                          Analyze Resume <ChevronRight size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Last Prediction */}
                {progress?.prediction_role && (
                  <div className="pt-pred-card" style={{ marginBottom: 16 }}>
                    <div className="pt-pred-label">Last Career Prediction</div>
                    <div className="pt-pred-role">
                      🏆 {progress.prediction_role}
                    </div>
                    {progress.prediction_score && (
                      <div className="pt-pred-score">
                        Success probability:{" "}
                        {typeof progress.prediction_score === "number"
                          ? `${Math.round(progress.prediction_score * 100)}%`
                          : progress.prediction_score}
                      </div>
                    )}
                  </div>
                )}

                {/* Skills gap */}
                <div className="pt-skills-grid" style={{ marginBottom: 16 }}>
                  <div className="pt-skills-col">
                    <div
                      className="pt-skills-col-label"
                      style={{ color: "var(--db-skill-have-color)" }}
                    >
                      <CheckCircle size={13} /> Skills You Have (
                      {skillsHave.length})
                    </div>
                    <div>
                      {skillsHave.length > 0 ? (
                        skillsHave.map((s, i) => (
                          <span key={i} className="pt-skill-tag pt-skill-have">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--db-score-empty-color)",
                          }}
                        >
                          Analyze your resume to auto-detect skills
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="pt-skills-col">
                    <div
                      className="pt-skills-col-label"
                      style={{ color: "var(--db-skill-miss-color)" }}
                    >
                      <AlertCircle size={13} /> Skills to Learn (
                      {skillsMissing.length})
                    </div>
                    <div>
                      {skillsMissing.length > 0 ? (
                        skillsMissing.map((s, i) => (
                          <span key={i} className="pt-skill-tag pt-skill-miss">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--db-skill-have-color)",
                          }}
                        >
                          ✓ You have all required skills!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges from progress */}
                {progress?.badges?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div className="pt-achievements-label">
                      Achievements Unlocked
                    </div>
                    {progress.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="db-badge-chip"
                        style={{
                          background: `rgba(${badge.color},0.07)`,
                          borderColor: `rgba(${badge.color},0.2)`,
                        }}
                      >
                        <span>{badge.icon}</span>
                        <span
                          style={{
                            fontSize: 13,
                            color: `rgb(${badge.color})`,
                            fontWeight: 600,
                          }}
                        >
                          {badge.name}
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-actions">
                  <button
                    className="pt-action-btn pt-action-primary"
                    onClick={() => navigate("/career-predictor")}
                  >
                    <TrendingUp size={13} /> Career Predictor
                  </button>
                  <button
                    className="pt-action-btn pt-action-secondary"
                    onClick={() => navigate("/resume-validator")}
                  >
                    <FileText size={13} /> Analyze Resume
                  </button>
                  <button
                    className="pt-action-btn pt-action-secondary"
                    onClick={() => navigate("/recommendations")}
                  >
                    <Zap size={13} /> Jobs & Learning
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Charts */}
          <div className="db-charts">
            <div className="db-panel" data-testid="salary-trends-card">
              <div className="db-panel-head">
                <div>
                  <div className="db-panel-title">Average Salary by Role</div>
                  <div className="db-panel-sub">Industry salary benchmarks</div>
                </div>
                <span className="db-panel-tag">Market Data</span>
              </div>
              <div className="db-divider" />
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={analytics?.salary_trends || []}
                  barCategoryGap="32%"
                >
                  <defs>
                    <linearGradient id="dbBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2997ff" />
                      <stop
                        offset="100%"
                        stopColor="#5ac8fa"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={
                      isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"
                    }
                    vertical={false}
                  />
                  <XAxis
                    dataKey="role"
                    tick={{
                      fontSize: 11,
                      fill: isDark ? "#6e6e73" : "#94a3b8",
                      fontFamily: "inherit",
                    }}
                    axisLine={false}
                    tickLine={false}
                    angle={-10}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: isDark ? "#6e6e73" : "#94a3b8",
                      fontFamily: "inherit",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{
                      fill: isDark
                        ? "rgba(41,151,255,0.05)"
                        : "rgba(41,151,255,0.04)",
                    }}
                    formatter={(v) => [`$${v.toLocaleString()}`, "Avg Salary"]}
                  />
                  <Bar
                    dataKey="avg_salary"
                    fill="url(#dbBarGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="db-panel" data-testid="skills-demand-card">
              <div className="db-panel-head">
                <div>
                  <div className="db-panel-title">Top Skills in Demand</div>
                  <div className="db-panel-sub">Market demand percentage</div>
                </div>
                <span className="db-panel-tag">Skills</span>
              </div>
              <div className="db-divider" />
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics?.top_skills || []}
                    dataKey="demand"
                    nameKey="skill"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={46}
                    label={({ skill, demand }) => `${skill} ${demand}%`}
                    labelLine={{
                      stroke: isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    {(analytics?.top_skills || []).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills Detail */}
          <div
            className="db-panel"
            style={{ marginBottom: 20 }}
            data-testid="skills-detail-card"
          >
            <div className="db-panel-head">
              <div>
                <div className="db-panel-title">Skills Demand Details</div>
                <div className="db-panel-sub">Breakdown by market demand</div>
              </div>
              <span className="db-panel-tag">Breakdown</span>
            </div>
            <div className="db-divider" />
            {analytics?.top_skills?.map((skill, idx) => (
              <div
                key={idx}
                className="db-skill-row"
                data-testid={`skill-detail-${idx}`}
              >
                <div
                  className="db-skill-num"
                  style={{
                    background: `${COLORS[idx % COLORS.length]}18`,
                    color: COLORS[idx % COLORS.length],
                    border: `1px solid ${COLORS[idx % COLORS.length]}28`,
                  }}
                >
                  {idx + 1}
                </div>
                <span className="db-skill-name">{skill.skill}</span>
                <div className="db-skill-track">
                  <div
                    className="db-skill-fill"
                    style={{
                      width: `${skill.demand}%`,
                      background: `linear-gradient(90deg, ${COLORS[idx % COLORS.length]}, ${COLORS[(idx + 1) % COLORS.length]})`,
                    }}
                  />
                </div>
                <span className="db-skill-pct">{skill.demand}%</span>
              </div>
            ))}
          </div>

          {/* Badges */}
          {analytics?.badges && analytics.badges.length > 0 && (
            <div className="db-panel" data-testid="badges-card">
              <div className="db-panel-head">
                <div>
                  <div className="db-panel-title">Achievements</div>
                  <div className="db-panel-sub">Badges you've unlocked</div>
                </div>
                <span className="db-panel-tag">Earned</span>
              </div>
              <div className="db-divider" />
              <div>
                {analytics.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="db-badge-chip"
                    data-testid={`badge-${idx}`}
                  >
                    <span>🏆</span>
                    <span className="db-badge-text">{badge}</span>
                  </span>
                ))}
                <span className="db-badge-more">
                  <span className="db-badge-more-text">
                    More badges unlocking…
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div
          className="pt-modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowRoleModal(false)
          }
        >
          <div className="pt-modal">
            <div className="pt-modal-head">
              <div className="pt-modal-title">Set Your Target Role</div>
              <button
                className="pt-modal-close"
                onClick={() => setShowRoleModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="pt-roles-grid">
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  className={`pt-role-option ${selectedRole === role ? "active" : ""}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
            <button
              className="pt-modal-save"
              onClick={handleSaveRole}
              disabled={savingRole}
            >
              {savingRole ? "Saving…" : "Save Goal"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
