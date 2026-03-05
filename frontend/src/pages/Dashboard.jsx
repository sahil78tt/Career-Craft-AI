import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/App";
import { toast } from "sonner";
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
import { TrendingUp, Award, Activity, Target } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchDashboard();
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

  const COLORS = ["#2997ff", "#5ac8fa", "#34d399", "#a78bfa", "#fbbf24"];

  if (loading)
    return (
      <>
        <style>{`@keyframes dbSpin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: "rgba(41,151,255,0.1)",
                border: "1px solid rgba(41,151,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: "2px solid #2997ff",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "dbSpin 0.8s linear infinite",
                }}
              />
            </div>
            <p style={{ color: "#6e6e73", fontSize: "13px", fontWeight: 500 }}>
              Loading your dashboard…
            </p>
          </div>
        </div>
      </>
    );

  const metrics = [
    {
      label: "Predictions Made",
      value: analytics?.predictions_made || 0,
      icon: TrendingUp,
      color: "#34d399",
      accent: "52,211,153",
      badge: "+3 this week",
      testid: "predictions-stat",
    },
    {
      label: "Resumes Analyzed",
      value: analytics?.resumes_analyzed || 0,
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
      value: analytics?.badges?.length || 0,
      icon: Award,
      color: "#a78bfa",
      accent: "167,139,250",
      badge: "Top 20%",
      testid: "badges-stat",
    },
  ];

  const tooltipStyle = {
    background: "#111111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    color: "#f5f5f7",
    fontSize: "12px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    padding: "10px 14px",
  };

  return (
    <>
      <style>{`
        .db-root {
          min-height: 100vh;
          background: #000000;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          padding: 100px 40px 80px;
          position: relative;
          overflow: hidden;
        }
        @media(max-width: 768px) { .db-root { padding: 100px 20px 60px; } }

        .db-glow-top {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 1000px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(41,151,255,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .db-glow-right {
          position: fixed; top: 20%; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(90,200,250,0.04) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .db-inner {
          position: relative; z-index: 10;
          max-width: 1200px; margin: 0 auto;
        }

        .db-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 52px; flex-wrap: wrap; gap: 16px;
        }
        .db-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 14px; border-radius: 999px;
          background: rgba(41,151,255,0.1); border: 1px solid rgba(41,151,255,0.2);
          color: #2997ff; font-size: 12px; font-weight: 500;
          letter-spacing: 0.02em; margin-bottom: 16px;
        }
        .db-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #2997ff;
          animation: dbPulse 2.5s ease-in-out infinite;
        }
        @keyframes dbPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
        .db-title {
          font-size: clamp(30px, 4vw, 48px); font-weight: 700; color: #f5f5f7;
          letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 10px;
        }
        .db-title-accent {
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .db-subtitle { color: #6e6e73; font-size: 16px; font-weight: 400; }
        .db-live-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 999px;
          background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2);
          font-size: 12px; font-weight: 600; color: #34d399;
          letter-spacing: 0.04em; text-transform: uppercase;
        }
        .db-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #34d399;
          animation: dbPulse 2s ease-in-out infinite;
        }

        /* Metric Cards */
        .db-metrics {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        @media(min-width: 1024px) { .db-metrics { grid-template-columns: repeat(4, 1fr); } }

        .db-metric {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px;
          position: relative; overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default; backdrop-filter: blur(20px);
        }
        .db-metric:hover {
          border-color: rgba(255,255,255,0.14);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .db-metric-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          border-radius: 20px 20px 0 0;
        }
        .db-metric-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 20px;
        }
        .db-metric-icon {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .db-metric-badge {
          font-size: 10px; letter-spacing: 0.03em;
          padding: 4px 10px; border-radius: 999px; font-weight: 500;
          white-space: nowrap;
        }
        .db-metric-val {
          font-size: 40px; font-weight: 700; line-height: 1;
          margin-bottom: 6px; letter-spacing: -0.04em;
        }
        .db-metric-lbl { color: #6e6e73; font-size: 12px; font-weight: 500; letter-spacing: 0.01em; }

        /* Panel Cards */
        .db-panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px;
          backdrop-filter: blur(20px);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .db-panel:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }
        .db-panel-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 24px;
        }
        .db-panel-title {
          font-size: 16px; font-weight: 600; color: #f5f5f7;
          letter-spacing: -0.01em; margin-bottom: 4px;
        }
        .db-panel-sub { font-size: 13px; color: #6e6e73; }
        .db-panel-tag {
          font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(41,151,255,0.08); border: 1px solid rgba(41,151,255,0.18);
          color: #5ac8fa; font-weight: 600;
        }
        .db-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 20px; }

        /* Charts */
        .db-charts { display: grid; gap: 20px; margin-bottom: 20px; }
        @media(min-width: 1024px) { .db-charts { grid-template-columns: 3fr 2fr; } }

        /* Skills */
        .db-skill-row {
          display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
        }
        .db-skill-num {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
        }
        .db-skill-name { color: #f5f5f7; font-size: 13px; font-weight: 500; flex: 1; }
        .db-skill-pct { font-size: 11px; color: #6e6e73; width: 34px; text-align: right; flex-shrink: 0; }
        .db-skill-track {
          height: 5px; background: rgba(255,255,255,0.06);
          border-radius: 999px; flex: 1; overflow: hidden; min-width: 120px;
        }
        .db-skill-fill {
          height: 100%; border-radius: 999px;
          transition: width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Badges */
        .db-badge-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 999px;
          background: rgba(251,191,36,0.07); border: 1px solid rgba(251,191,36,0.18);
          margin-right: 8px; margin-bottom: 8px;
          transition: all 0.2s ease; cursor: default;
        }
        .db-badge-chip:hover {
          background: rgba(251,191,36,0.12);
          border-color: rgba(251,191,36,0.35);
          transform: translateY(-1px);
        }
        .db-badge-text { font-size: 13px; color: #fbbf24; font-weight: 600; }
        .db-badge-more {
          display: inline-flex; align-items: center;
          padding: 8px 16px; border-radius: 999px;
          background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1);
          margin-bottom: 8px;
        }
        .db-badge-more-text { font-size: 13px; color: #3a3a3c; }
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

          {/* Charts */}
          <div className="db-charts">
            {/* Bar Chart */}
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
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="role"
                    tick={{
                      fontSize: 11,
                      fill: "#6e6e73",
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
                      fill: "#6e6e73",
                      fontFamily: "inherit",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(41,151,255,0.05)" }}
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

            {/* Pie Chart */}
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
                    labelLine={{ stroke: "rgba(255,255,255,0.08)" }}
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
    </>
  );
};

export default Dashboard;
