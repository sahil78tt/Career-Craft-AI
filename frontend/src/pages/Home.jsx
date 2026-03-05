import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  FileText,
  Briefcase,
  LayoutDashboard,
  CheckCircle,
  Target,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const Home = ({ user }) => {
  const features = [
    {
      icon: "📈",
      title: "Career Predictor",
      desc: "ML-powered success forecasting based on your profile, skills, and market data.",
      href: "/career-predictor",
      tag: "Machine Learning",
    },
    {
      icon: "📄",
      title: "Resume Analyzer",
      desc: "NLP-driven resume scoring with actionable feedback and real course suggestions.",
      href: "/resume-validator",
      tag: "NLP",
    },
    {
      icon: "💼",
      title: "Job Recommendations",
      desc: "Personalized job matches and curated learning paths aligned to your goals.",
      href: "/recommendations",
      tag: "AI Matching",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      desc: "Track your progress, skill gaps, and career trajectory with live insights.",
      href: "/dashboard",
      tag: "Analytics",
    },
  ];

  const benefits = [
    "ML-powered career success predictions",
    "NLP-based resume analysis",
    "Personalized job recommendations",
    "Custom learning paths",
  ];

  const stats = [
    { value: "94%", label: "Prediction Accuracy" },
    { value: "12k+", label: "Careers Shaped" },
    { value: "200+", label: "Job Categories" },
    { value: "4.9★", label: "User Rating" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          /* Apple dark palette */
          --bg:       #000000;
          --bg-1:     #0a0a0a;
          --bg-2:     #111111;
          --bg-3:     #1a1a1a;
          --bg-4:     #222222;
          --surface:  rgba(255,255,255,0.05);
          --surface2: rgba(255,255,255,0.08);
          --border:   rgba(255,255,255,0.08);
          --border2:  rgba(255,255,255,0.13);
          --border3:  rgba(255,255,255,0.2);
          --text-1:   #f5f5f7;
          --text-2:   #a1a1a6;
          --text-3:   #6e6e73;
          --text-4:   #3d3d40;
          --blue:     #2997ff;
          --blue-dim: rgba(41,151,255,0.15);
          --blue-glow:rgba(41,151,255,0.08);
          --green:    #30d158;
          --sh-sm: 0 2px 12px rgba(0,0,0,0.4);
          --sh-md: 0 8px 32px rgba(0,0,0,0.5);
          --sh-lg: 0 20px 60px rgba(0,0,0,0.6);
          --sh-xl: 0 32px 100px rgba(0,0,0,0.7);
          --r-sm:6px; --r-md:12px; --r-lg:16px; --r-xl:20px; --r-2xl:28px; --r-3xl:36px;
        }

        .dk-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          color: var(--text-1);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* Radial top glow — Apple-style */
        .dk-root::before {
          content: '';
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 1000px; height: 700px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(41,151,255,0.1) 0%, rgba(41,151,255,0.03) 40%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .dk-page {
          position: relative; z-index: 1;
          max-width: 1080px; margin: 0 auto; padding: 0 32px;
        }
        @media(max-width:768px){ .dk-page { padding: 0 20px; } }

        /* ══════════════════
           HERO
        ══════════════════ */
        .dk-hero {
          padding: 128px 0 96px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }

        /* Eyebrow */
        .dk-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 16px 7px 10px; border-radius: 999px;
          background: var(--surface); border: 1px solid var(--border2);
          font-size: 12px; font-weight: 500; color: var(--text-2);
          letter-spacing: -0.01em; margin-bottom: 32px;
          backdrop-filter: blur(12px);
          animation: dkFade 0.9s ease both;
        }
        .dk-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--blue); box-shadow: 0 0 8px var(--blue);
          animation: dkPulse 2.5s ease-in-out infinite;
        }
        @keyframes dkPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        .dk-eyebrow-sep { width: 1px; height: 10px; background: var(--border2); }
        .dk-eyebrow-new { color: var(--blue); font-weight: 600; font-size: 11.5px; }

        /* Greeting */
        .dk-greeting {
          font-size: 13px; color: var(--text-3); letter-spacing: -0.01em;
          margin-bottom: 14px;
          animation: dkFade 0.9s 0.05s ease both;
        }

        /* H1 */
        .dk-h1 {
          font-size: clamp(52px, 7.5vw, 96px);
          font-weight: 700; letter-spacing: -0.045em; line-height: 1.0;
          color: var(--text-1); margin-bottom: 24px;
          animation: dkFade 0.9s 0.09s ease both;
        }
        .dk-h1-em {
          background: linear-gradient(135deg, #2997ff 0%, #5ac8fa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* Sub */
        .dk-sub {
          font-size: 19px; font-weight: 400; color: var(--text-2);
          max-width: 540px; line-height: 1.63; margin-bottom: 44px;
          letter-spacing: -0.015em;
          animation: dkFade 0.9s 0.14s ease both;
        }
        .dk-sub b { color: var(--text-1); font-weight: 500; }

        /* CTAs */
        .dk-ctas {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          animation: dkFade 0.9s 0.19s ease both;
          margin-bottom: 0;
        }
        .dk-btn-p {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 980px;
          background: var(--blue); color: #fff;
          font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 500;
          text-decoration: none; letter-spacing: -0.01em;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 32px rgba(41,151,255,0.25);
        }
        .dk-btn-p:hover { opacity: 0.88; transform: scale(1.01); }

        .dk-btn-g {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 26px; border-radius: 980px;
          background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text-2); font-family: 'Inter', sans-serif;
          font-size: 15px; font-weight: 500; text-decoration: none; letter-spacing: -0.01em;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .dk-btn-g:hover { background: rgba(255,255,255,0.12); border-color: var(--border3); color: var(--text-1); transform: scale(1.01); }

        /* Trust row */
        .dk-trust {
          display: flex; align-items: center; gap: 18px; margin-top: 28px;
          animation: dkFade 0.9s 0.24s ease both;
        }
        .dk-trust-sep { width: 1px; height: 14px; background: var(--border2); }
        .dk-trust-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-3); letter-spacing: -0.01em; }
        .dk-trust-item svg { color: var(--green); }

        /* Product mockup */
        .dk-mockup-wrap {
          margin-top: 72px; width: 100%; max-width: 860px;
          animation: dkFadeUp 1.1s 0.28s ease both;
        }
        .dk-mockup {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--r-2xl);
          overflow: hidden;
          box-shadow: var(--sh-xl), 0 0 0 1px rgba(255,255,255,0.03), 0 0 80px rgba(41,151,255,0.06);
        }
        .dk-mockup-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 14px 18px;
          background: var(--bg-3); border-bottom: 1px solid var(--border);
        }
        .dk-mdot { width: 10px; height: 10px; border-radius: 50%; }
        .dk-mockup-url {
          flex: 1; text-align: center; margin: 0 44px;
          font-size: 11.5px; color: var(--text-3);
          background: var(--bg-4); border: 1px solid var(--border);
          padding: 5px 14px; border-radius: 8px; letter-spacing: -0.01em;
        }
        .dk-mockup-body {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 1px; background: var(--border);
        }
        .dk-mcell {
          background: var(--bg-1);
          padding: 24px 22px; display: flex; flex-direction: column; gap: 6px;
        }
        .dk-mc-lbl { font-size: 10.5px; font-weight: 500; color: var(--text-3); letter-spacing: 0.04em; text-transform: uppercase; }
        .dk-mc-val { font-size: 28px; font-weight: 700; letter-spacing: -0.04em; color: var(--text-1); line-height: 1; }
        .dk-mc-sub { font-size: 11.5px; color: var(--text-3); letter-spacing: -0.01em; }
        .dk-mc-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 999px; width: fit-content; margin-top: 2px;
          font-size: 10.5px; font-weight: 600; letter-spacing: -0.01em;
          background: rgba(48,209,88,0.12); color: var(--green); border: 1px solid rgba(48,209,88,0.2);
        }
        .dk-mc-bar-track { height: 3px; background: var(--bg-4); border-radius: 999px; overflow: hidden; margin-top: 8px; }
        .dk-mc-bar-fill { height: 100%; border-radius: 999px; }

        /* ══════════════════
           STATS
        ══════════════════ */
        .dk-stats {
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); border-radius: var(--r-xl); overflow: hidden;
          margin-bottom: 96px;
          box-shadow: var(--sh-sm);
        }
        @media(max-width:768px){ .dk-stats { grid-template-columns: repeat(2,1fr); } }
        .dk-stat {
          background: var(--bg-1); padding: 34px 28px; text-align: center;
          position: relative; overflow: hidden;
          transition: background 0.25s;
        }
        .dk-stat::before {
          content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .dk-stat:hover { background: var(--bg-2); }
        .dk-stat:hover::before { opacity: 1; }
        .dk-stat-val {
          font-size: 40px; font-weight: 700; letter-spacing: -0.045em;
          color: var(--text-1); line-height: 1; margin-bottom: 7px;
        }
        .dk-stat-lbl { font-size: 13px; color: var(--text-3); font-weight: 400; letter-spacing: -0.01em; }

        /* ══════════════════
           SECTION HEADER
        ══════════════════ */
        .dk-sh { margin-bottom: 44px; }
        .dk-sh-eyebrow {
          font-size: 12px; font-weight: 500; color: var(--blue);
          letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px;
        }
        .dk-sh-h {
          font-size: clamp(30px, 4vw, 46px); font-weight: 700;
          letter-spacing: -0.038em; color: var(--text-1);
          line-height: 1.06; margin-bottom: 12px;
        }
        .dk-sh-h em { font-style: normal; color: var(--blue); }
        .dk-sh-sub { font-size: 16px; color: var(--text-2); line-height: 1.65; max-width: 400px; letter-spacing: -0.01em; }

        /* ══════════════════
           FEATURES
        ══════════════════ */
        .dk-features { margin-bottom: 96px; }
        .dk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media(max-width:640px){ .dk-grid { grid-template-columns: 1fr; } }

        .dk-fcard {
          display: block; text-decoration: none;
          background: var(--bg-1); border: 1px solid var(--border);
          border-radius: var(--r-xl); padding: 32px 28px 28px;
          position: relative; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.28s, transform 0.3s cubic-bezier(.22,1,.36,1), background 0.25s;
          box-shadow: var(--sh-sm);
        }
        .dk-fcard::before {
          content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(41,151,255,0.6), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .dk-fcard:hover {
          border-color: var(--border2);
          background: var(--bg-2);
          box-shadow: var(--sh-lg), 0 0 0 1px rgba(255,255,255,0.04);
          transform: translateY(-4px);
        }
        .dk-fcard:hover::before { opacity: 1; }

        /* Wide card */
        .dk-fcard-wide {
          grid-column: 1 / -1;
          display: grid; grid-template-columns: 1fr 300px; gap: 48px; align-items: center;
          padding: 36px 36px;
        }
        @media(max-width:640px){ .dk-fcard-wide { grid-template-columns: 1fr; gap: 24px; } }

        .dk-fnum {
          font-size: 11px; font-weight: 500; color: var(--text-4);
          letter-spacing: 0.04em; margin-bottom: 20px;
        }
        .dk-ficon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 48px; height: 48px; border-radius: var(--r-md);
          font-size: 22px; background: var(--bg-3); border: 1px solid var(--border);
          margin-bottom: 18px;
          transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), background 0.25s, box-shadow 0.25s;
        }
        .dk-fcard:hover .dk-ficon { transform: scale(1.1) rotate(-4deg); background: var(--blue-dim); box-shadow: 0 4px 16px rgba(41,151,255,0.15); }

        .dk-ftag {
          display: inline-block; padding: 3px 10px; border-radius: 999px;
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em;
          background: var(--blue-dim); color: var(--blue);
          border: 1px solid rgba(41,151,255,0.2);
          margin-bottom: 12px;
        }
        .dk-fh {
          font-size: 20px; font-weight: 600; letter-spacing: -0.025em;
          color: var(--text-1); margin-bottom: 9px; line-height: 1.2;
        }
        .dk-fp { font-size: 14px; color: var(--text-2); line-height: 1.7; letter-spacing: -0.005em; }
        .dk-fcta {
          display: inline-flex; align-items: center; gap: 4px;
          margin-top: 22px; font-size: 13px; font-weight: 500; color: var(--blue);
          opacity: 0; transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .dk-fcard:hover .dk-fcta { opacity: 1; transform: translateX(0); }
        .dk-fcta svg { transition: transform 0.2s; }
        .dk-fcard:hover .dk-fcta svg { transform: translateX(3px); }

        /* Skill bars */
        .dk-bars-box {
          padding: 18px 16px;
          background: var(--bg-3); border: 1px solid var(--border);
          border-radius: var(--r-lg);
        }
        .dk-bars-head { display: flex; justify-content: space-between; margin-bottom: 14px; }
        .dk-bars-ttl { font-size: 10.5px; font-weight: 600; color: var(--text-2); letter-spacing: 0.04em; text-transform: uppercase; }
        .dk-bars-sub { font-size: 10.5px; color: var(--text-3); }
        .dk-bars { display: flex; flex-direction: column; gap: 11px; }
        .dk-bar-row { display: flex; align-items: center; gap: 10px; }
        .dk-bar-lbl { font-size: 11px; color: var(--text-3); width: 50px; flex-shrink: 0; letter-spacing: -0.01em; }
        .dk-bar-track { flex: 1; height: 4px; background: var(--bg-4); border-radius: 999px; overflow: hidden; }
        .dk-bar-fill { height: 100%; border-radius: 999px; }
        .dk-bar-pct { font-size: 11px; color: var(--text-3); width: 30px; text-align: right; flex-shrink: 0; }

        /* ══════════════════
           BENEFITS
        ══════════════════ */
        .dk-benefits {
          margin-bottom: 96px;
          background: var(--bg-1); border: 1px solid var(--border);
          border-radius: var(--r-2xl); overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          box-shadow: var(--sh-md);
        }
        @media(max-width:768px){ .dk-benefits { grid-template-columns: 1fr; } }

        .dk-ben-l {
          padding: 56px 48px;
          border-right: 1px solid var(--border);
          position: relative;
        }
        @media(max-width:768px){ .dk-ben-l { border-right: none; border-bottom: 1px solid var(--border); padding: 40px 32px; } }
        /* Left accent line */
        .dk-ben-l::before {
          content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent 0%, var(--blue) 40%, transparent 100%);
          opacity: 0.4;
        }
        .dk-ben-h {
          font-size: clamp(26px, 3vw, 36px); font-weight: 700; letter-spacing: -0.034em;
          color: var(--text-1); line-height: 1.1; margin-bottom: 14px;
        }
        .dk-ben-h em { font-style: normal; color: var(--blue); }
        .dk-ben-sub { font-size: 15px; color: var(--text-2); line-height: 1.72; letter-spacing: -0.01em; }

        .dk-ben-r { padding: 48px 44px; }
        @media(max-width:768px){ .dk-ben-r { padding: 36px 32px; } }
        .dk-ben-cap { font-size: 10.5px; font-weight: 500; color: var(--text-3); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px; }
        .dk-blist { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .dk-bitem {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; border-radius: var(--r-md);
          background: var(--bg-2); border: 1px solid var(--border);
          font-size: 14px; color: var(--text-2); font-weight: 400; letter-spacing: -0.01em;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.22s;
        }
        .dk-bitem:hover { background: var(--blue-glow); border-color: rgba(41,151,255,0.2); color: var(--text-1); transform: translateX(4px); }
        .dk-bcheck {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
          background: var(--blue-dim); border: 1px solid rgba(41,151,255,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--blue);
        }

        /* ══════════════════
           CTA BANNER
        ══════════════════ */
        .dk-cta {
          margin-bottom: 80px;
          background: var(--bg-1); border: 1px solid var(--border);
          border-radius: var(--r-2xl); padding: 88px 48px; text-align: center;
          position: relative; overflow: hidden;
          box-shadow: var(--sh-lg);
        }
        /* Top glow */
        .dk-cta::before {
          content: ''; position: absolute; top: -150px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(41,151,255,0.15) 0%, rgba(41,151,255,0.03) 50%, transparent 70%);
          pointer-events: none;
        }
        /* Top hairline */
        .dk-cta::after {
          content: ''; position: absolute; top: -1px; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(41,151,255,0.5), transparent);
        }
        .dk-cta-ey {
          font-size: 11.5px; font-weight: 500; color: var(--text-3);
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 18px; position: relative;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .dk-cta-ey::before, .dk-cta-ey::after {
          content: ''; flex: 1; max-width: 32px; height: 1px;
          background: var(--border2);
        }
        .dk-cta-h {
          font-size: clamp(38px, 5.5vw, 64px); font-weight: 700;
          letter-spacing: -0.045em; color: var(--text-1); line-height: 1.01;
          margin-bottom: 18px; position: relative;
        }
        .dk-cta-h em {
          font-style: normal;
          background: linear-gradient(135deg, #2997ff 0%, #5ac8fa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .dk-cta-sub {
          font-size: 17px; color: var(--text-2); letter-spacing: -0.015em;
          line-height: 1.65; max-width: 400px; margin: 0 auto 40px; position: relative;
        }
        .dk-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; }

        /* ══════════════════
           DIVIDER
        ══════════════════ */
        .dk-div { height: 1px; background: var(--border); margin: 0 0 80px; }

        /* ══════════════════
           ANIMATIONS
        ══════════════════ */
        @keyframes dkFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dkFadeUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="dk-root">
        <div className="dk-page">
          {/* ══ HERO ══ */}
          <div className="dk-hero">
            <div className="dk-eyebrow">
              <div className="dk-eyebrow-dot" />
              AI-Powered Career Intelligence
              <div className="dk-eyebrow-sep" />
              <span className="dk-eyebrow-new">New</span>
            </div>

            <div className="dk-greeting">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </div>

            <h1 className="dk-h1">
              Transform your
              <br />
              <span className="dk-h1-em">career</span> journey
            </h1>

            <p className="dk-sub">
              Your intelligent platform powered by <b>Machine Learning</b> and{" "}
              <b>NLP</b> to help you achieve professional success.
            </p>

            <div className="dk-ctas">
              <a href="/career-predictor" className="dk-btn-p">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0L10.5 5.5L16 6.5L12 10.5L13 16L8 13L3 16L4 10.5L0 6.5L5.5 5.5L8 0Z" />
                </svg>
                Get Started
              </a>
              <a href="/dashboard" className="dk-btn-g">
                View Dashboard <ChevronRight size={14} />
              </a>
            </div>

            <div className="dk-trust">
              <div className="dk-trust-item">
                <CheckCircle size={13} /> 94% accuracy
              </div>
              <div className="dk-trust-sep" />
              <div className="dk-trust-item">
                <CheckCircle size={13} /> 12k+ careers shaped
              </div>
              <div className="dk-trust-sep" />
              <div className="dk-trust-item">
                <CheckCircle size={13} /> Rated 4.9★
              </div>
            </div>

            {/* Product mockup */}
            <div className="dk-mockup-wrap">
              <div className="dk-mockup">
                <div className="dk-mockup-bar">
                  <div className="dk-mdot" style={{ background: "#ff5f57" }} />
                  <div className="dk-mdot" style={{ background: "#febc2e" }} />
                  <div className="dk-mdot" style={{ background: "#28c840" }} />
                  <div className="dk-mockup-url">
                    career-craft.ai — dashboard
                  </div>
                </div>
                <div className="dk-mockup-body">
                  <div className="dk-mcell">
                    <div className="dk-mc-lbl">Resume Score</div>
                    <div className="dk-mc-val">91</div>
                    <div className="dk-mc-badge">↑ +12 pts</div>
                    <div className="dk-mc-bar-track">
                      <div
                        className="dk-mc-bar-fill"
                        style={{
                          width: "91%",
                          background: "linear-gradient(90deg,#2997ff,#5ac8fa)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="dk-mcell">
                    <div className="dk-mc-lbl">Success Probability</div>
                    <div className="dk-mc-val">
                      87
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 400,
                          color: "var(--text-3)",
                        }}
                      >
                        %
                      </span>
                    </div>
                    <div className="dk-mc-sub">Predicted: Senior level</div>
                    <div className="dk-mc-bar-track">
                      <div
                        className="dk-mc-bar-fill"
                        style={{
                          width: "87%",
                          background: "linear-gradient(90deg,#30d158,#34d399)",
                        }}
                      />
                    </div>
                  </div>
                  <div className="dk-mcell">
                    <div className="dk-mc-lbl">Top Skill Match</div>
                    <div className="dk-mc-val" style={{ fontSize: "20px" }}>
                      Python
                    </div>
                    <div className="dk-mc-sub">experience_years · 92%</div>
                    <div className="dk-mc-bar-track">
                      <div
                        className="dk-mc-bar-fill"
                        style={{
                          width: "92%",
                          background: "linear-gradient(90deg,#bf5af2,#da8fff)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ STATS ══ */}
          <div className="dk-stats">
            {stats.map((s, i) => (
              <div key={i} className="dk-stat">
                <div className="dk-stat-val">{s.value}</div>
                <div className="dk-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="dk-div" />

          {/* ══ FEATURES ══ */}
          <div className="dk-features">
            <div className="dk-sh">
              <div className="dk-sh-eyebrow">Platform Features</div>
              <h2 className="dk-sh-h">
                Powerful <em>features</em>
              </h2>
              <p className="dk-sh-sub">
                Everything you need to accelerate your career growth.
              </p>
            </div>

            <div className="dk-grid">
              {/* Wide card */}
              <a href={features[0].href} className="dk-fcard dk-fcard-wide">
                <div>
                  <div className="dk-fnum">
                    01 / {String(features.length).padStart(2, "0")}
                  </div>
                  <div className="dk-ficon">{features[0].icon}</div>
                  <div className="dk-ftag">{features[0].tag}</div>
                  <h3 className="dk-fh">{features[0].title}</h3>
                  <p className="dk-fp">{features[0].desc}</p>
                  <span className="dk-fcta">
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
                <div className="dk-bars-box">
                  <div className="dk-bars-head">
                    <span className="dk-bars-ttl">Skill match</span>
                    <span className="dk-bars-sub">vs. role</span>
                  </div>
                  <div className="dk-bars">
                    {[
                      ["Python", 92, "linear-gradient(90deg,#2997ff,#5ac8fa)"],
                      ["React", 78, "linear-gradient(90deg,#bf5af2,#da8fff)"],
                      ["ML/AI", 85, "linear-gradient(90deg,#30d158,#34d399)"],
                      ["SQL", 65, "linear-gradient(90deg,#ff9f0a,#ffd60a)"],
                    ].map(([lbl, pct, g]) => (
                      <div key={lbl} className="dk-bar-row">
                        <span className="dk-bar-lbl">{lbl}</span>
                        <div className="dk-bar-track">
                          <div
                            className="dk-bar-fill"
                            style={{ width: `${pct}%`, background: g }}
                          />
                        </div>
                        <span className="dk-bar-pct">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </a>

              {features.slice(1).map((f, i) => (
                <a key={i} href={f.href} className="dk-fcard">
                  <div className="dk-fnum">
                    {String(i + 2).padStart(2, "0")} /{" "}
                    {String(features.length).padStart(2, "0")}
                  </div>
                  <div className="dk-ficon">{f.icon}</div>
                  <div className="dk-ftag">{f.tag}</div>
                  <h3 className="dk-fh">{f.title}</h3>
                  <p className="dk-fp">{f.desc}</p>
                  <span className="dk-fcta">
                    Explore <ArrowRight size={12} />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="dk-div" />

          {/* ══ BENEFITS ══ */}
          <div className="dk-benefits">
            <div className="dk-ben-l">
              <div className="dk-sh-eyebrow" style={{ marginBottom: "10px" }}>
                Why Us
              </div>
              <h2 className="dk-ben-h">
                Why <em>CareerCraft AI</em>
                <br />
                stands apart
              </h2>
              <p className="dk-ben-sub">
                Built with cutting-edge ML and NLP to give you a real,
                measurable edge in your career journey.
              </p>
            </div>
            <div className="dk-ben-r">
              <div className="dk-ben-cap">Core capabilities</div>
              <ul className="dk-blist">
                {benefits.map((b, i) => (
                  <li key={i} className="dk-bitem">
                    <div className="dk-bcheck">
                      <CheckCircle size={11} />
                    </div>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ══ CTA ══ */}
          <div className="dk-cta">
            <div className="dk-cta-ey">Get started today</div>
            <h2 className="dk-cta-h">
              Ready to shape
              <br />
              your <em>future?</em>
            </h2>
            <p className="dk-cta-sub">
              Join thousands of professionals accelerating their careers with
              AI.
            </p>
            <div className="dk-cta-btns">
              <a href="/career-predictor" className="dk-btn-p">
                <Zap size={14} /> Start Predicting
              </a>
              <a href="/dashboard" className="dk-btn-g">
                View Dashboard <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
