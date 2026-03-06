import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/App";
import { toast } from "sonner";
import {
  Briefcase,
  BookOpen,
  Target,
  MapPin,
  DollarSign,
  Clock,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ── Course thumbnail with graceful fallback ────────────────────────────────
const COURSE_GRADIENTS = [
  "linear-gradient(135deg,#0d1f3c 0%,#1a2a4a 100%)",
  "linear-gradient(135deg,#16213e 0%,#1a1a2e 100%)",
  "linear-gradient(135deg,#0f2027 0%,#2c5364 100%)",
  "linear-gradient(135deg,#1e1e2e 0%,#2a1a3e 100%)",
  "linear-gradient(135deg,#0a1628 0%,#1a2a1a 100%)",
  "linear-gradient(135deg,#1a0a28 0%,#2e1a3e 100%)",
];
const COURSE_ICONS = [
  "📊",
  "🐍",
  "🤖",
  "📋",
  "🎯",
  "⚛️",
  "☁️",
  "🔒",
  "🎨",
  "📱",
];

const CourseImage = ({ src, title, index }) => {
  const [failed, setFailed] = useState(!src);
  const gradient = COURSE_GRADIENTS[index % COURSE_GRADIENTS.length];
  const icon = COURSE_ICONS[index % COURSE_ICONS.length];

  if (!src || failed) {
    return (
      <div className="jr-course-placeholder" style={{ background: gradient }}>
        <div className="jr-course-placeholder-icon">{icon}</div>
        <div className="jr-course-placeholder-text">
          {title?.split(" ").slice(0, 3).join(" ") || "Course"}
        </div>
      </div>
    );
  }

  return (
    <img
      className="jr-course-img"
      src={src}
      alt={title}
      onError={() => setFailed(true)}
    />
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
const JobRecommendations = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [targetRole, setTargetRole] = useState("software_engineer");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [learningPath, setLearningPath] = useState(null);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  // ── ORIGINAL LOGIC UNTOUCHED ──────────────────────────────────────────────
  useEffect(() => {
    const loadFromResume = () => {
      try {
        const raw = localStorage.getItem("last_resume_analysis");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.skills?.length > 0) {
          const normalized = parsed.skills.map((s) => s.toLowerCase().trim());
          setSkills((prev) => Array.from(new Set([...normalized, ...prev])));
        }
      } catch (e) {}
    };
    loadFromResume();
    window.addEventListener("resumeAnalysisUpdated", loadFromResume);
    return () =>
      window.removeEventListener("resumeAnalysisUpdated", loadFromResume);
  }, []);

  useEffect(() => {
    if (skills.length > 0 && !autoLoaded) {
      setAutoLoaded(true);
      handleGetJobs();
      handleGetLearningPath();
    }
  }, [skills]); // eslint-disable-line

  const convertToINR = (salary) => {
    if (!salary || salary === "Not disclosed") return "Not disclosed";
    try {
      const numbers = String(salary).match(/[\d.]+/g);
      if (!numbers) return salary;
      const firstNum = parseFloat(numbers[0]);
      const isAlreadyINR = firstNum > 10000;
      let inrValues;
      if (isAlreadyINR)
        inrValues = numbers.map((num) =>
          parseFloat(num).toLocaleString("en-IN"),
        );
      else {
        const rate = 83;
        inrValues = numbers.map((num) =>
          (parseFloat(num) * rate).toLocaleString("en-IN"),
        );
      }
      if (inrValues.length === 2)
        return `₹ ${inrValues[0]} - ₹ ${inrValues[1]}`;
      return `₹ ${inrValues[0]}`;
    } catch {
      return salary;
    }
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !skills.includes(skillInput.trim().toLowerCase())
    ) {
      setSkills([...skills, skillInput.trim().toLowerCase()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) =>
    setSkills(skills.filter((s) => s !== skillToRemove));

  const handleGetJobs = async () => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/recommend_jobs", { skills });
      setJobs(response.data.jobs || []);
      toast.success("Jobs loaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLearningPath = async () => {
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/learning_path", {
        skills,
        target_role: targetRole,
      });
      setLearningPath(response.data);
      toast.success("Learning path generated!");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to generate learning path",
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    "software_engineer",
    "data_scientist",
    "frontend_developer",
    "devops_engineer",
    "ml_engineer",
  ];

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #000000;
          --bg-1:     #0a0a0a;
          --bg-2:     #111111;
          --bg-3:     #1a1a1a;
          --bg-4:     #222222;
          --border:   rgba(255,255,255,0.08);
          --border2:  rgba(255,255,255,0.13);
          --border3:  rgba(255,255,255,0.2);
          --text-1:   #f5f5f7;
          --text-2:   #a1a1a6;
          --text-3:   #6e6e73;
          --text-4:   #3d3d40;
          --blue:     #2997ff;
          --blue-dim: rgba(41,151,255,0.12);
          --blue-glow:rgba(41,151,255,0.07);
          --green:    #30d158;
          --green-dim:rgba(48,209,88,0.1);
          --amber:    #ff9f0a;
          --amber-dim:rgba(255,159,10,0.1);
          --purple:   #bf5af2;
          --purple-dim:rgba(191,90,242,0.1);
          --sh-sm: 0 2px 12px rgba(0,0,0,0.4);
          --sh-md: 0 8px 32px rgba(0,0,0,0.5);
          --sh-lg: 0 20px 60px rgba(0,0,0,0.6);
          --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:20px; --r-2xl:28px;
        }

        .jr-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          color: var(--text-1);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          position: relative;
          padding: 88px 32px 100px;
        }
        @media(max-width:768px){ .jr-root { padding: 80px 20px 80px; } }

        /* Top radial glow */
        .jr-root::before {
          content: '';
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(41,151,255,0.08) 0%, rgba(41,151,255,0.02) 45%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .jr-inner {
          max-width: 1100px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .jr-header { margin-bottom: 52px; animation: jrFade 0.8s ease both; }

        .jr-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11.5px; font-weight: 500; color: var(--blue);
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 18px;
        }
        .jr-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--blue); box-shadow: 0 0 8px var(--blue);
          animation: jrPulse 2.5s ease-in-out infinite;
        }
        @keyframes jrPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        .jr-title {
          font-size: clamp(34px, 5vw, 60px);
          font-weight: 700; letter-spacing: -0.042em; line-height: 1.0;
          color: var(--text-1); margin-bottom: 16px;
        }
        .jr-title-em {
          background: linear-gradient(135deg, #2997ff 0%, #5ac8fa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .jr-sub {
          font-size: 16px; color: var(--text-2); letter-spacing: -0.01em;
          line-height: 1.65; max-width: 440px;
        }

        /* ── Cards ── */
        .jr-card {
          background: var(--bg-1);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          padding: 24px 26px;
          margin-bottom: 16px;
          transition: border-color 0.25s;
          animation: jrFade 0.8s 0.1s ease both;
        }
        .jr-card:hover { border-color: var(--border2); }

        .jr-card-label {
          font-size: 11px; font-weight: 500; color: var(--text-3);
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;
        }
        .jr-card-title {
          font-size: 15px; font-weight: 600; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 4px;
          display: flex; align-items: center; gap: 8px;
        }
        .jr-card-sub {
          font-size: 13px; color: var(--text-3); letter-spacing: -0.01em;
          margin-bottom: 18px;
        }

        /* ── Skills input ── */
        .jr-skill-row {
          display: flex; gap: 10px; margin-bottom: 14px;
        }
        .jr-skill-input {
          flex: 1; padding: 11px 14px;
          border-radius: var(--r-md); font-size: 14px;
          background: var(--bg-3); border: 1px solid var(--border);
          color: var(--text-1); outline: none;
          font-family: 'Inter', sans-serif; letter-spacing: -0.01em;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .jr-skill-input::placeholder { color: var(--text-4); }
        .jr-skill-input:focus {
          border-color: var(--blue);
          background: var(--bg-2);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.12);
        }
        .jr-add-btn {
          padding: 11px 20px; border-radius: var(--r-md);
          border: 1px solid var(--border2);
          background: var(--bg-3);
          color: var(--text-1); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: 'Inter', sans-serif;
          white-space: nowrap; letter-spacing: -0.01em;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .jr-add-btn:hover { background: var(--blue-dim); border-color: rgba(41,151,255,0.3); color: var(--blue); }

        .jr-skills-list { display: flex; flex-wrap: wrap; gap: 7px; }
        .jr-skill-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 11px; border-radius: var(--r-sm);
          background: var(--bg-3); border: 1px solid var(--border2);
          color: var(--text-2); font-size: 12px; font-weight: 400;
          letter-spacing: -0.01em;
        }
        .jr-skill-remove {
          display: flex; align-items: center; cursor: pointer;
          color: var(--text-4); background: none; border: none; padding: 0;
          transition: color 0.2s;
        }
        .jr-skill-remove:hover { color: #ff453a; }

        /* ── Tabs ── */
        .jr-tabs {
          display: flex; background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: var(--r-lg); padding: 4px; margin-bottom: 24px;
          gap: 4px; animation: jrFade 0.8s 0.14s ease both;
        }
        .jr-tab {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px; border-radius: var(--r-md);
          font-size: 13px; font-weight: 500; cursor: pointer;
          border: none; font-family: 'Inter', sans-serif; letter-spacing: -0.01em;
          transition: background 0.2s, color 0.2s;
        }
        .jr-tab.active {
          background: var(--bg-4); color: var(--text-1);
          border: 1px solid var(--border2);
        }
        .jr-tab.inactive { background: transparent; color: var(--text-3); }
        .jr-tab.inactive:hover { color: var(--text-2); }

        /* ── Fetch / Action buttons ── */
        .jr-fetch-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin: 0 auto 28px; padding: 13px 32px;
          border-radius: 980px; border: none;
          font-size: 14px; font-weight: 500; cursor: pointer;
          background: var(--blue); color: #fff;
          font-family: 'Inter', sans-serif; letter-spacing: -0.01em;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 24px rgba(41,151,255,0.2);
        }
        .jr-fetch-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.01); }
        .jr-fetch-btn:disabled { opacity: 0.38; cursor: not-allowed; }

        .jr-gen-btn {
          width: 100%; padding: 13px; border-radius: 980px;
          border: none; font-size: 14px; font-weight: 500; cursor: pointer;
          background: var(--blue); color: #fff;
          font-family: 'Inter', sans-serif; letter-spacing: -0.01em;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 24px rgba(41,151,255,0.18);
        }
        .jr-gen-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.01); }
        .jr-gen-btn:disabled { opacity: 0.38; cursor: not-allowed; }

        /* ── Jobs grid ── */
        .jr-jobs-grid {
          display: grid; gap: 12px;
        }
        @media(min-width:768px){ .jr-jobs-grid { grid-template-columns: 1fr 1fr; } }
        @media(min-width:1024px){ .jr-jobs-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .jr-job {
          background: var(--bg-1); border: 1px solid var(--border);
          border-radius: var(--r-xl); padding: 20px 22px;
          cursor: pointer; text-decoration: none; display: block;
          transition: border-color 0.25s, transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s;
          position: relative; overflow: hidden;
        }
        .jr-job::before {
          content: ''; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(41,151,255,0.5), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .jr-job:hover {
          border-color: var(--border2);
          transform: translateY(-4px);
          box-shadow: var(--sh-lg);
        }
        .jr-job:hover::before { opacity: 1; }

        .jr-job-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 10px; margin-bottom: 14px;
        }
        .jr-job-title {
          font-size: 14px; font-weight: 600; letter-spacing: -0.018em;
          color: var(--text-1); margin-bottom: 3px;
        }
        .jr-job-company { font-size: 12.5px; color: var(--text-3); letter-spacing: -0.01em; }

        .jr-match {
          padding: 4px 10px; border-radius: 999px; flex-shrink: 0;
          background: var(--green-dim); border: 1px solid rgba(48,209,88,0.2);
          color: var(--green); font-size: 11px; font-weight: 600; white-space: nowrap;
        }

        .jr-job-meta {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: var(--text-3); margin-bottom: 7px;
          letter-spacing: -0.01em;
        }
        .jr-job-meta svg { color: var(--text-4); flex-shrink: 0; }

        .jr-job-skills {
          font-size: 12px; color: var(--text-3); margin-bottom: 16px;
          line-height: 1.55; letter-spacing: -0.01em;
        }
        .jr-skills-lbl {
          font-size: 10px; font-weight: 500; color: var(--text-4);
          text-transform: uppercase; letter-spacing: 0.06em;
        }

        .jr-apply-btn {
          width: 100%; padding: 9px 14px;
          border-radius: var(--r-md); border: 1px solid var(--border2);
          background: var(--bg-3); color: var(--text-2);
          font-size: 13px; font-weight: 500; cursor: pointer;
          font-family: 'Inter', sans-serif; letter-spacing: -0.01em;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .jr-apply-btn:hover { background: var(--blue-dim); border-color: rgba(41,151,255,0.3); color: var(--blue); }

        /* ── Roles grid ── */
        .jr-roles-grid {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: 8px; margin-bottom: 18px;
        }
        @media(min-width:768px){ .jr-roles-grid { grid-template-columns: repeat(3,1fr); } }

        .jr-role-btn {
          padding: 11px 14px; border-radius: var(--r-md);
          border: 1px solid var(--border); background: var(--bg-2);
          color: var(--text-3); font-size: 13px; font-weight: 400;
          cursor: pointer; font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em; text-align: center;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .jr-role-btn.active {
          background: var(--blue-dim); border-color: rgba(41,151,255,0.3); color: var(--blue); font-weight: 500;
        }
        .jr-role-btn:hover:not(.active) { border-color: var(--border2); color: var(--text-2); }

        /* ── Learning path ── */
        .jr-roadmap { margin-bottom: 16px; }
        .jr-roadmap-title {
          font-size: 14px; font-weight: 600; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }

        .jr-roadmap-step {
          display: flex; gap: 14px; margin-bottom: 10px; align-items: flex-start;
        }
        .jr-step-circle {
          width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
          background: var(--blue-dim); border: 1px solid rgba(41,151,255,0.25);
          color: var(--blue); font-size: 11px; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
        }
        .jr-step-text {
          font-size: 13px; color: var(--text-2); line-height: 1.65;
          padding-top: 4px; letter-spacing: -0.01em;
        }

        /* ── Gap analysis ── */
        .jr-gap-section { margin-bottom: 16px; }
        .jr-gap-label {
          font-size: 10.5px; font-weight: 500; color: var(--text-3);
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
        }

        .jr-skill-tag {
          display: inline-flex; padding: 4px 10px; border-radius: var(--r-sm);
          background: var(--blue-dim); border: 1px solid rgba(41,151,255,0.2);
          color: var(--blue); font-size: 11.5px; font-weight: 500; margin: 3px;
          letter-spacing: -0.01em;
        }
        .jr-gap-tag {
          display: inline-flex; padding: 4px 10px; border-radius: var(--r-sm);
          background: var(--amber-dim); border: 1px solid rgba(255,159,10,0.2);
          color: var(--amber); font-size: 11.5px; font-weight: 500; margin: 3px;
          letter-spacing: -0.01em;
        }

        .jr-timeline {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 16px; border-radius: var(--r-md);
          background: var(--bg-2); border: 1px solid var(--border);
          margin-top: 14px;
        }
        .jr-timeline-text {
          font-size: 13px; color: var(--text-2); letter-spacing: -0.01em;
        }
        .jr-timeline-text strong { color: var(--blue); font-weight: 600; }

        /* ── Courses grid ── */
        .jr-courses-head {
          font-size: 15px; font-weight: 600; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 14px;
        }
        .jr-courses-grid { display: grid; gap: 12px; }
        @media(min-width:768px){ .jr-courses-grid { grid-template-columns: 1fr 1fr; } }
        @media(min-width:1024px){ .jr-courses-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .jr-course {
          border-radius: var(--r-xl); overflow: hidden;
          background: var(--bg-1); border: 1px solid var(--border);
          text-decoration: none; display: block;
          transition: border-color 0.25s, transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s;
        }
        .jr-course:hover {
          border-color: var(--border2);
          transform: translateY(-4px);
          box-shadow: var(--sh-lg);
        }

        /* ── Course thumbnail — fixed ── */
        .jr-course-img-wrap {
          height: 140px; overflow: hidden;
          position: relative; background: var(--bg-2);
        }
        .jr-course-img {
          width: 100%; height: 140px; object-fit: cover;
          transition: transform 0.35s; display: block;
        }
        .jr-course:hover .jr-course-img { transform: scale(1.04); }

        /* Gradient placeholder shown when no image / image fails */
        .jr-course-placeholder {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
        }
        .jr-course-placeholder-icon { font-size: 32px; line-height: 1; }
        .jr-course-placeholder-text {
          font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.45);
          letter-spacing: 0.06em; text-transform: uppercase;
          text-align: center; padding: 0 12px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .jr-course-body { padding: 14px 16px; }
        .jr-course-title {
          font-size: 13px; font-weight: 500; color: var(--text-1);
          margin-bottom: 10px; letter-spacing: -0.01em;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; line-height: 1.5;
          transition: color 0.2s;
        }
        .jr-course:hover .jr-course-title { color: var(--blue); }
        .jr-course-footer {
          display: flex; justify-content: space-between; align-items: center;
        }
        .jr-course-platform { font-size: 11.5px; color: var(--text-3); }
        .jr-course-price { font-size: 13px; font-weight: 600; color: var(--green); }

        .jr-rel-badge {
          display: inline-flex; font-size: 10.5px; padding: 3px 8px;
          border-radius: 999px; margin-bottom: 8px;
          background: var(--purple-dim); color: var(--purple);
          border: 1px solid rgba(191,90,242,0.2);
        }
        .jr-dur {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: var(--text-3); margin-top: 7px;
          letter-spacing: -0.01em;
        }

        /* ── Empty ── */
        .jr-empty {
          text-align: center; padding: 64px 24px;
          color: var(--text-4); font-size: 14px; letter-spacing: -0.01em;
        }

        /* ── Animations ── */
        @keyframes jrFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="jr-root">
        <div className="jr-inner" data-testid="job-recommendations-page">
          {/* ── Header ── */}
          <div className="jr-header">
            <div className="jr-eyebrow">
              <div className="jr-eyebrow-dot" />
              AI-Matched Opportunities
            </div>
            <h1 className="jr-title">
              Jobs &amp; <span className="jr-title-em">Learning</span>
            </h1>
            <p className="jr-sub">
              Discover personalized job recommendations and learning paths
              tailored to your skills.
            </p>
          </div>

          {/* ── Skills Input ── */}
          <div className="jr-card" data-testid="skills-input-card">
            <div className="jr-card-title">Your Skills</div>
            <p className="jr-card-sub">
              Add your current skills to get personalized recommendations
            </p>
            <div className="jr-skill-row">
              <input
                className="jr-skill-input"
                placeholder="e.g. python, javascript, react"
                value={skillInput}
                data-testid="skill-input"
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <button
                className="jr-add-btn"
                onClick={addSkill}
                data-testid="add-skill-btn"
              >
                + Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="jr-skills-list" data-testid="skills-list">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="jr-skill-chip"
                    data-testid={`skill-badge-${idx}`}
                  >
                    {skill}
                    <button
                      className="jr-skill-remove"
                      onClick={() => removeSkill(skill)}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Tabs ── */}
          <div className="jr-tabs">
            <button
              className={`jr-tab ${activeTab === "jobs" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("jobs")}
              data-testid="jobs-tab"
            >
              <Briefcase size={13} /> Job Recommendations
            </button>
            <button
              className={`jr-tab ${activeTab === "learning" ? "active" : "inactive"}`}
              onClick={() => setActiveTab("learning")}
              data-testid="learning-tab"
            >
              <BookOpen size={13} /> Learning Path
            </button>
          </div>

          {/* ── Jobs Tab ── */}
          {activeTab === "jobs" && (
            <div>
              <button
                className="jr-fetch-btn"
                onClick={handleGetJobs}
                disabled={loading || skills.length === 0}
                data-testid="get-jobs-btn"
              >
                {loading ? (
                  "Loading…"
                ) : (
                  <>
                    <Briefcase size={13} /> Get Job Recommendations
                  </>
                )}
              </button>

              {jobs.length > 0 ? (
                <div className="jr-jobs-grid" data-testid="jobs-grid">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="jr-job"
                      onClick={() => window.open(job.apply_link, "_blank")}
                      data-testid={`job-card-${job.id}`}
                    >
                      <div className="jr-job-top">
                        <div>
                          <div className="jr-job-title">{job.title}</div>
                          <div className="jr-job-company">{job.company}</div>
                        </div>
                        <span
                          className="jr-match"
                          data-testid={`job-match-${job.id}`}
                        >
                          {job.match_score}% match
                        </span>
                      </div>
                      <div className="jr-job-meta">
                        <MapPin size={11} />
                        {job.location}
                      </div>
                      <div className="jr-job-meta">
                        <DollarSign size={11} />
                        💰 {convertToINR(job.salary)}
                      </div>
                      <div className="jr-job-skills">
                        <span className="jr-skills-lbl">Skills: </span>
                        {job.skills}
                      </div>
                      <button
                        className="jr-apply-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(job.apply_link, "_blank");
                        }}
                      >
                        Apply Now <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="jr-empty">
                  Add skills and click "Get Job Recommendations" to see matching
                  opportunities
                </div>
              )}
            </div>
          )}

          {/* ── Learning Tab ── */}
          {activeTab === "learning" && (
            <div>
              <div className="jr-card">
                <div className="jr-card-title">
                  <Target size={15} color="#2997ff" /> Target Role
                </div>
                <p className="jr-card-sub">Select your desired career path</p>
                <div className="jr-roles-grid">
                  {roles.map((role) => (
                    <button
                      key={role}
                      className={`jr-role-btn ${targetRole === role ? "active" : ""}`}
                      onClick={() => setTargetRole(role)}
                      data-testid={`role-${role}`}
                    >
                      {role
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>
                <button
                  className="jr-gen-btn"
                  onClick={handleGetLearningPath}
                  disabled={loading || skills.length === 0}
                  data-testid="generate-path-btn"
                >
                  {loading ? "Generating…" : "Generate Learning Path"}
                </button>
              </div>

              {learningPath && (
                <div data-testid="learning-path-result">
                  {/* Roadmap */}
                  {learningPath?.roadmap?.length > 0 && (
                    <div className="jr-card jr-roadmap">
                      <div className="jr-roadmap-title">
                        🗺️ AI Career Roadmap
                      </div>
                      {learningPath.roadmap.map((step, index) => (
                        <div key={index} className="jr-roadmap-step">
                          <div className="jr-step-circle">{index + 1}</div>
                          <div className="jr-step-text">{step}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gap Analysis */}
                  <div className="jr-card" style={{ marginBottom: "16px" }}>
                    <div
                      className="jr-card-title"
                      style={{ marginBottom: "16px" }}
                    >
                      <Target size={14} color="#2997ff" /> Skill Gap Analysis
                    </div>
                    <div className="jr-gap-section">
                      <div className="jr-gap-label">Required Skills</div>
                      <div>
                        {learningPath.required_skills?.length > 0 ? (
                          learningPath.required_skills.map((s, i) => (
                            <span
                              key={i}
                              className="jr-skill-tag"
                              data-testid={`required-skill-${i}`}
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{ color: "var(--text-4)", fontSize: "13px" }}
                          >
                            No data available
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="jr-gap-section">
                      <div className="jr-gap-label">Skills to Learn</div>
                      <div>
                        {learningPath.skill_gap?.length > 0 ? (
                          learningPath.skill_gap.map((s, i) => (
                            <span
                              key={i}
                              className="jr-gap-tag"
                              data-testid={`gap-skill-${i}`}
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{ color: "var(--green)", fontSize: "13px" }}
                          >
                            ✓ All required skills covered!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="jr-timeline">
                      <Clock size={14} color="#2997ff" />
                      <span className="jr-timeline-text">
                        Estimated Timeline:{" "}
                        <strong>
                          {learningPath.estimated_timeline || "N/A"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Courses */}
                  {learningPath.recommended_courses?.length > 0 && (
                    <div>
                      <div className="jr-courses-head">Recommended Courses</div>
                      <div
                        className="jr-courses-grid"
                        data-testid="courses-grid"
                      >
                        {learningPath.recommended_courses.map(
                          (course, index) => (
                            <a
                              key={index}
                              href={course.link || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="jr-course"
                              data-testid={`course-card-${index}`}
                            >
                              {/* ── Thumbnail with graceful fallback ── */}
                              <div className="jr-course-img-wrap">
                                <CourseImage
                                  src={course.thumbnail}
                                  title={course.title}
                                  index={index}
                                />
                              </div>

                              <div className="jr-course-body">
                                {course.relevance_score && (
                                  <div className="jr-rel-badge">
                                    {course.relevance_score}% relevant
                                  </div>
                                )}
                                <div className="jr-course-title">
                                  {course.title}
                                </div>
                                <div className="jr-course-footer">
                                  <span className="jr-course-platform">
                                    {course.platform}
                                  </span>
                                  <span className="jr-course-price">
                                    {course.price}
                                  </span>
                                </div>
                                {course.duration && (
                                  <div className="jr-dur">
                                    <Clock size={10} />
                                    {course.duration}
                                  </div>
                                )}
                              </div>
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobRecommendations;
