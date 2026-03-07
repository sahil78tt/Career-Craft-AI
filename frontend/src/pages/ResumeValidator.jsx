import React, { useState } from "react";
import { axiosInstance } from "@/App";
import { toast } from "sonner";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Upload,
} from "lucide-react";

const ResumeValidator = () => {
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputMode, setInputMode] = useState("text");
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".pdf")) {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleAnalyze = async () => {
    if (inputMode === "text" && !resumeText.trim()) {
      toast.error("Please enter your resume text");
      return;
    }
    if (inputMode === "file" && !selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (inputMode === "text") formData.append("resume_text", resumeText);
      else formData.append("file", selectedFile);
      const response = await axiosInstance.post("/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      try {
        localStorage.setItem(
          "last_resume_analysis",
          JSON.stringify(response.data),
        );
        window.dispatchEvent(new Event("resumeAnalysisUpdated"));
      } catch (e) {}
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#5ac8fa";
    if (score >= 40) return "#fbbf24";
    return "#f87171";
  };

  return (
    <>
      <style>{`
        /* ── Dark (default) ── */
        :root, [data-theme="dark"] {
          --rv-bg:              #000000;
          --rv-glow-top:        rgba(41,151,255,0.08);
          --rv-glow-accent:     rgba(90,200,250,0.04);
          --rv-card-bg:         rgba(255,255,255,0.03);
          --rv-card-border:     rgba(255,255,255,0.08);
          --rv-card-hover-border: rgba(255,255,255,0.12);
          --rv-card-hover-shadow: 0 8px 40px rgba(0,0,0,0.3);
          --rv-text-1:          #f5f5f7;
          --rv-text-2:          #a1a1a6;
          --rv-text-3:          #6e6e73;
          --rv-text-4:          #3a3a3c;
          --rv-icon-bg:         rgba(41,151,255,0.1);
          --rv-icon-border:     rgba(41,151,255,0.2);
          --rv-icon-warn-bg:    rgba(251,191,36,0.1);
          --rv-icon-warn-border:rgba(251,191,36,0.2);
          --rv-tabs-bg:         rgba(255,255,255,0.04);
          --rv-tabs-border:     rgba(255,255,255,0.07);
          --rv-tab-active-shadow: 0 2px 12px rgba(41,151,255,0.35);
          --rv-tab-inactive-color: #6e6e73;
          --rv-tab-hover-bg:    rgba(255,255,255,0.05);
          --rv-tab-hover-color: #a1a1a6;
          --rv-textarea-bg:     rgba(255,255,255,0.03);
          --rv-textarea-border: rgba(255,255,255,0.08);
          --rv-textarea-color:  #f5f5f7;
          --rv-textarea-focus-bg:     rgba(41,151,255,0.03);
          --rv-textarea-focus-border: rgba(41,151,255,0.4);
          --rv-textarea-focus-shadow: rgba(41,151,255,0.08);
          --rv-textarea-placeholder: #3a3a3c;
          --rv-drop-bg:         transparent;
          --rv-drop-border:     rgba(255,255,255,0.1);
          --rv-drop-hover-border: rgba(41,151,255,0.3);
          --rv-drop-hover-bg:   rgba(255,255,255,0.02);
          --rv-drop-over-border: rgba(41,151,255,0.5);
          --rv-drop-over-bg:    rgba(41,151,255,0.04);
          --rv-drop-icon-bg:    rgba(255,255,255,0.04);
          --rv-drop-icon-border: rgba(255,255,255,0.08);
          --rv-drop-text-color: #a1a1a6;
          --rv-drop-hint-color: #3a3a3c;
          --rv-file-pill-bg:    rgba(41,151,255,0.06);
          --rv-file-pill-border: rgba(41,151,255,0.15);
          --rv-file-name-color: #f5f5f7;
          --rv-file-size-color: #6e6e73;
          --rv-score-box-bg:    rgba(255,255,255,0.02);
          --rv-score-box-border: rgba(255,255,255,0.07);
          --rv-score-denom-color: #3a3a3c;
          --rv-score-label-color: #6e6e73;
          --rv-prog-track-bg:   rgba(255,255,255,0.06);
          --rv-stat-bg:         rgba(255,255,255,0.02);
          --rv-stat-border:     rgba(255,255,255,0.07);
          --rv-stat-val-color:  #2997ff;
          --rv-stat-lbl-color:  #6e6e73;
          --rv-skill-chip-bg:   rgba(41,151,255,0.08);
          --rv-skill-chip-border: rgba(41,151,255,0.18);
          --rv-skill-chip-color: #5ac8fa;
          --rv-skill-chip-hover-bg: rgba(41,151,255,0.14);
          --rv-skill-chip-hover-border: rgba(41,151,255,0.3);
          --rv-bias-chip-bg:    rgba(248,113,113,0.08);
          --rv-bias-chip-border: rgba(248,113,113,0.2);
          --rv-bias-chip-color: #f87171;
          --rv-course-bg:       rgba(255,255,255,0.02);
          --rv-course-border:   rgba(255,255,255,0.07);
          --rv-course-hover-border: rgba(41,151,255,0.25);
          --rv-course-hover-shadow: 0 12px 40px rgba(0,0,0,0.4);
          --rv-course-img-bg:   #111111;
          --rv-course-title-color: #f5f5f7;
          --rv-course-platform-color: #6e6e73;
          --rv-empty-icon-bg:   rgba(255,255,255,0.03);
          --rv-empty-icon-border: rgba(255,255,255,0.07);
          --rv-empty-title-color: #a1a1a6;
          --rv-empty-sub-color: #3a3a3c;
          --rv-warn-bg:         rgba(248,113,113,0.04);
          --rv-warn-border:     rgba(248,113,113,0.14);
          --rv-warn-note-color: #6e6e73;
          --rv-divider:         rgba(255,255,255,0.06);
          --rv-no-skills-color: #3a3a3c;
        }

        /* ── Light ── */
        [data-theme="light"] {
          --rv-bg:              #f5f7fa;
          --rv-glow-top:        rgba(41,151,255,0.05);
          --rv-glow-accent:     rgba(59,130,246,0.03);
          --rv-card-bg:         #ffffff;
          --rv-card-border:     rgba(0,0,0,0.08);
          --rv-card-hover-border: rgba(0,0,0,0.14);
          --rv-card-hover-shadow: 0 8px 40px rgba(0,0,0,0.08);
          --rv-text-1:          #1e293b;
          --rv-text-2:          #64748b;
          --rv-text-3:          #94a3b8;
          --rv-text-4:          #94a3b8;
          --rv-icon-bg:         rgba(41,151,255,0.08);
          --rv-icon-border:     rgba(41,151,255,0.15);
          --rv-icon-warn-bg:    rgba(245,158,11,0.08);
          --rv-icon-warn-border:rgba(245,158,11,0.2);
          --rv-tabs-bg:         rgba(0,0,0,0.03);
          --rv-tabs-border:     rgba(0,0,0,0.07);
          --rv-tab-active-shadow: 0 2px 12px rgba(41,151,255,0.25);
          --rv-tab-inactive-color: #64748b;
          --rv-tab-hover-bg:    rgba(0,0,0,0.04);
          --rv-tab-hover-color: #1e293b;
          --rv-textarea-bg:     #f8faff;
          --rv-textarea-border: rgba(0,0,0,0.08);
          --rv-textarea-color:  #1e293b;
          --rv-textarea-focus-bg:     rgba(41,151,255,0.02);
          --rv-textarea-focus-border: rgba(41,151,255,0.3);
          --rv-textarea-focus-shadow: rgba(41,151,255,0.06);
          --rv-textarea-placeholder: #94a3b8;
          --rv-drop-bg:         transparent;
          --rv-drop-border:     rgba(0,0,0,0.1);
          --rv-drop-hover-border: rgba(41,151,255,0.3);
          --rv-drop-hover-bg:   rgba(0,0,0,0.01);
          --rv-drop-over-border: rgba(41,151,255,0.4);
          --rv-drop-over-bg:    rgba(41,151,255,0.03);
          --rv-drop-icon-bg:    rgba(0,0,0,0.03);
          --rv-drop-icon-border: rgba(0,0,0,0.07);
          --rv-drop-text-color: #64748b;
          --rv-drop-hint-color: #94a3b8;
          --rv-file-pill-bg:    rgba(41,151,255,0.05);
          --rv-file-pill-border: rgba(41,151,255,0.12);
          --rv-file-name-color: #1e293b;
          --rv-file-size-color: #64748b;
          --rv-score-box-bg:    #f8faff;
          --rv-score-box-border: rgba(0,0,0,0.07);
          --rv-score-denom-color: #94a3b8;
          --rv-score-label-color: #94a3b8;
          --rv-prog-track-bg:   rgba(0,0,0,0.06);
          --rv-stat-bg:         #f8faff;
          --rv-stat-border:     rgba(0,0,0,0.07);
          --rv-stat-val-color:  #2997ff;
          --rv-stat-lbl-color:  #64748b;
          --rv-skill-chip-bg:   rgba(41,151,255,0.07);
          --rv-skill-chip-border: rgba(41,151,255,0.15);
          --rv-skill-chip-color: #2997ff;
          --rv-skill-chip-hover-bg: rgba(41,151,255,0.12);
          --rv-skill-chip-hover-border: rgba(41,151,255,0.25);
          --rv-bias-chip-bg:    rgba(239,68,68,0.06);
          --rv-bias-chip-border: rgba(239,68,68,0.18);
          --rv-bias-chip-color: #dc2626;
          --rv-course-bg:       #f8faff;
          --rv-course-border:   rgba(0,0,0,0.07);
          --rv-course-hover-border: rgba(41,151,255,0.2);
          --rv-course-hover-shadow: 0 12px 40px rgba(0,0,0,0.1);
          --rv-course-img-bg:   #eef2f7;
          --rv-course-title-color: #1e293b;
          --rv-course-platform-color: #94a3b8;
          --rv-empty-icon-bg:   #f8faff;
          --rv-empty-icon-border: rgba(0,0,0,0.07);
          --rv-empty-title-color: #64748b;
          --rv-empty-sub-color: #94a3b8;
          --rv-warn-bg:         rgba(239,68,68,0.03);
          --rv-warn-border:     rgba(239,68,68,0.12);
          --rv-warn-note-color: #94a3b8;
          --rv-divider:         rgba(0,0,0,0.06);
          --rv-no-skills-color: #94a3b8;
        }

        .rv-root {
          min-height: 100vh; background: var(--rv-bg);
          padding: 100px 24px 80px; position: relative; overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
          transition: background 0.3s;
        }
        .rv-glow-top { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 900px; height: 600px; background: radial-gradient(ellipse, var(--rv-glow-top) 0%, transparent 65%); pointer-events: none; }
        .rv-glow-accent { position: absolute; top: 200px; right: -100px; width: 500px; height: 500px; background: radial-gradient(ellipse, var(--rv-glow-accent) 0%, transparent 65%); pointer-events: none; }

        @keyframes rvPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }
        @keyframes rvPageIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

        .rv-inner { max-width: 1160px; margin: 0 auto; position: relative; z-index: 10; animation: rvPageIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .rv-eyebrow { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 999px; background: rgba(41,151,255,0.1); border: 1px solid rgba(41,151,255,0.2); color: #2997ff; font-size: 12px; font-weight: 500; letter-spacing: 0.02em; margin-bottom: 20px; }
        .rv-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #2997ff; animation: rvPulse 2.5s ease-in-out infinite; }
        .rv-title { font-size: clamp(32px, 4.5vw, 52px); font-weight: 700; color: var(--rv-text-1); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 14px; }
        .rv-title-accent { background: linear-gradient(135deg, #2997ff 0%, #5ac8fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .rv-subtitle { color: var(--rv-text-3); font-size: 17px; font-weight: 400; line-height: 1.5; margin-bottom: 52px; max-width: 500px; }
        .rv-layout { display: grid; gap: 24px; }
        @media(min-width: 1024px) { .rv-layout { grid-template-columns: 1fr 1fr; align-items: start; } }

        .rv-card { background: var(--rv-card-bg); border: 1px solid var(--rv-card-border); border-radius: 20px; padding: 28px; backdrop-filter: blur(20px); transition: border-color 0.3s ease, box-shadow 0.3s ease; }
        .rv-card:hover { border-color: var(--rv-card-hover-border); box-shadow: var(--rv-card-hover-shadow); }

        .rv-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
        .rv-card-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--rv-icon-bg); border: 1px solid var(--rv-icon-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rv-card-icon-warn { background: var(--rv-icon-warn-bg); border-color: var(--rv-icon-warn-border); }
        .rv-card-title { font-size: 17px; font-weight: 600; color: var(--rv-text-1); letter-spacing: -0.01em; }
        .rv-card-sub { color: var(--rv-text-3); font-size: 13px; margin-bottom: 22px; padding-left: 50px; margin-top: 2px; }

        .rv-tabs { display: flex; background: var(--rv-tabs-bg); border: 1px solid var(--rv-tabs-border); border-radius: 12px; padding: 4px; margin-bottom: 20px; gap: 4px; }
        .rv-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 12px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s ease; font-family: inherit; letter-spacing: -0.01em; }
        .rv-tab-active { background: #2997ff; color: #ffffff; font-weight: 600; box-shadow: var(--rv-tab-active-shadow); }
        .rv-tab-inactive { background: transparent; color: var(--rv-tab-inactive-color); }
        .rv-tab-inactive:hover { color: var(--rv-tab-hover-color); background: var(--rv-tab-hover-bg); }

        .rv-textarea { width: 100%; min-height: 300px; padding: 16px; border-radius: 14px; font-size: 13px; background: var(--rv-textarea-bg); border: 1px solid var(--rv-textarea-border); color: var(--rv-textarea-color); outline: none; resize: vertical; transition: border-color 0.2s ease, background 0.2s ease; font-family: 'SF Mono', 'Monaco', 'Menlo', monospace; line-height: 1.7; box-sizing: border-box; }
        .rv-textarea:focus { border-color: var(--rv-textarea-focus-border); background: var(--rv-textarea-focus-bg); box-shadow: 0 0 0 3px var(--rv-textarea-focus-shadow); }
        .rv-textarea::placeholder { color: var(--rv-textarea-placeholder); }

        .rv-dropzone { border: 1.5px dashed var(--rv-drop-border); border-radius: 16px; padding: 52px 24px; text-align: center; cursor: pointer; transition: all 0.3s ease; position: relative; background: var(--rv-drop-bg); }
        .rv-dropzone-over { border-color: var(--rv-drop-over-border); background: var(--rv-drop-over-bg); }
        .rv-dropzone:hover { border-color: var(--rv-drop-hover-border); background: var(--rv-drop-hover-bg); }
        .rv-drop-icon { width: 60px; height: 60px; border-radius: 18px; background: var(--rv-drop-icon-bg); border: 1px solid var(--rv-drop-icon-border); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; }
        .rv-drop-text { color: var(--rv-drop-text-color); font-size: 14px; margin-bottom: 6px; }
        .rv-drop-link { color: #2997ff; font-weight: 600; }
        .rv-drop-hint { font-size: 12px; color: var(--rv-drop-hint-color); margin-top: 4px; }

        .rv-file-pill { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px; background: var(--rv-file-pill-bg); border: 1px solid var(--rv-file-pill-border); margin-top: 14px; }
        .rv-file-name { font-size: 13px; font-weight: 500; color: var(--rv-file-name-color); flex: 1; }
        .rv-file-size { font-size: 12px; color: var(--rv-file-size-color); }

        .rv-btn { width: 100%; padding: 14px; border-radius: 14px; border: none; font-size: 15px; font-weight: 600; cursor: pointer; background: #2997ff; color: #ffffff; font-family: inherit; letter-spacing: -0.01em; transition: all 0.25s ease; margin-top: 18px; position: relative; overflow: hidden; }
        .rv-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%); pointer-events: none; }
        .rv-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(41,151,255,0.4); background: #2484e0; }
        .rv-btn:active:not(:disabled) { transform: translateY(0); }
        .rv-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .rv-results { display: flex; flex-direction: column; gap: 20px; }
        .rv-score-box { text-align: center; padding: 32px 24px 24px; border-radius: 16px; background: var(--rv-score-box-bg); border: 1px solid var(--rv-score-box-border); margin-top: 8px; }
        .rv-score-ring { position: relative; display: inline-block; margin-bottom: 16px; }
        .rv-score-num { font-size: 72px; font-weight: 700; line-height: 1; letter-spacing: -0.04em; }
        .rv-score-denom { font-size: 24px; color: var(--rv-score-denom-color); font-weight: 400; }
        .rv-score-label { font-size: 12px; color: var(--rv-score-label-color); letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px; }
        .rv-score-feedback { font-size: 14px; font-weight: 500; margin-bottom: 20px; line-height: 1.4; }
        .rv-prog-track { height: 6px; background: var(--rv-prog-track-bg); border-radius: 999px; overflow: hidden; }
        .rv-prog-fill { height: 100%; border-radius: 999px; transition: width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

        .rv-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
        .rv-stat { padding: 14px 12px; border-radius: 12px; background: var(--rv-stat-bg); border: 1px solid var(--rv-stat-border); text-align: center; }
        .rv-stat-val { font-size: 24px; font-weight: 700; color: var(--rv-stat-val-color); letter-spacing: -0.02em; margin-bottom: 3px; }
        .rv-stat-lbl { font-size: 11px; color: var(--rv-stat-lbl-color); letter-spacing: 0.02em; }

        .rv-skill-chip { display: inline-flex; align-items: center; padding: 5px 13px; border-radius: 999px; background: var(--rv-skill-chip-bg); border: 1px solid var(--rv-skill-chip-border); color: var(--rv-skill-chip-color); font-size: 12px; font-weight: 500; margin: 3px; transition: all 0.2s ease; }
        .rv-skill-chip:hover { background: var(--rv-skill-chip-hover-bg); border-color: var(--rv-skill-chip-hover-border); }

        .rv-bias-chip { display: inline-flex; align-items: center; padding: 5px 13px; border-radius: 999px; background: var(--rv-bias-chip-bg); border: 1px solid var(--rv-bias-chip-border); color: var(--rv-bias-chip-color); font-size: 12px; font-weight: 500; margin: 3px; }

        .rv-course-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .rv-course { border-radius: 14px; overflow: hidden; background: var(--rv-course-bg); border: 1px solid var(--rv-course-border); text-decoration: none; display: block; transition: all 0.3s ease; }
        .rv-course:hover { border-color: var(--rv-course-hover-border); transform: translateY(-3px); box-shadow: var(--rv-course-hover-shadow); }
        .rv-course-img { width: 100%; height: 80px; object-fit: cover; background: var(--rv-course-img-bg); display: block; }
        .rv-course-body { padding: 10px 12px 12px; }
        .rv-course-title { font-size: 12px; font-weight: 600; color: var(--rv-course-title-color); margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.45; }
        .rv-course-meta { display: flex; justify-content: space-between; align-items: center; }
        .rv-course-platform { font-size: 11px; color: var(--rv-course-platform-color); }
        .rv-course-price { font-size: 12px; font-weight: 600; color: #34d399; }

        .rv-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 440px; text-align: center; }
        .rv-empty-icon { width: 80px; height: 80px; border-radius: 24px; background: var(--rv-empty-icon-bg); border: 1px solid var(--rv-empty-icon-border); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .rv-empty-title { font-size: 17px; font-weight: 600; color: var(--rv-empty-title-color); margin-bottom: 8px; letter-spacing: -0.01em; }
        .rv-empty-sub { color: var(--rv-empty-sub-color); font-size: 14px; line-height: 1.6; max-width: 240px; }

        .rv-warn-card { background: var(--rv-warn-bg); border: 1px solid var(--rv-warn-border); border-radius: 16px; padding: 20px; }
        .rv-warn-header { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--rv-bias-chip-color); margin-bottom: 12px; letter-spacing: -0.01em; }
        .rv-warn-note { font-size: 12px; color: var(--rv-warn-note-color); margin-top: 10px; line-height: 1.5; }
        .rv-divider { height: 1px; background: var(--rv-divider); margin: 4px 0 18px; }
      `}</style>

      <div className="rv-root">
        <div className="rv-glow-top" />
        <div className="rv-glow-accent" />

        <div className="rv-inner" data-testid="resume-validator-page">
          <div className="rv-eyebrow">
            <span className="rv-eyebrow-dot" />
            NLP-Powered Analysis
          </div>
          <h1 className="rv-title">
            Resume <span className="rv-title-accent">Validator</span>
          </h1>
          <p className="rv-subtitle">
            Get instant AI-powered feedback on your resume quality and ATS
            compatibility.
          </p>

          <div className="rv-layout">
            <div className="rv-card" data-testid="resume-input-card">
              <div className="rv-card-header">
                <div className="rv-card-icon">
                  <FileText size={16} color="#2997ff" />
                </div>
                <span className="rv-card-title">Upload or Paste Resume</span>
              </div>
              <p className="rv-card-sub">
                Choose text input or upload a PDF file (max 5MB)
              </p>
              <div className="rv-divider" />
              <div className="rv-tabs">
                <button
                  className={`rv-tab ${inputMode === "text" ? "rv-tab-active" : "rv-tab-inactive"}`}
                  onClick={() => setInputMode("text")}
                  data-testid="text-input-tab"
                >
                  <FileText size={13} /> Text Input
                </button>
                <button
                  className={`rv-tab ${inputMode === "file" ? "rv-tab-active" : "rv-tab-inactive"}`}
                  onClick={() => setInputMode("file")}
                  data-testid="file-upload-tab"
                >
                  <Upload size={13} /> Upload PDF
                </button>
              </div>

              {inputMode === "text" ? (
                <textarea
                  className="rv-textarea"
                  data-testid="resume-text-input"
                  placeholder={
                    "Paste your resume text here...\n\nExample:\nJohn Doe\nSoftware Engineer\n\nExperience:\n- Developed web apps using Python and React\n- Led a team of 5 developers"
                  }
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              ) : (
                <div>
                  <label htmlFor="resume-file">
                    <div
                      className={`rv-dropzone ${dragOver ? "rv-dropzone-over" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const f = e.dataTransfer.files[0];
                        if (f) handleFileSelect({ target: { files: [f] } });
                      }}
                    >
                      <div className="rv-drop-icon">
                        <Upload size={22} color="var(--rv-text-3)" />
                      </div>
                      <p className="rv-drop-text">
                        <span className="rv-drop-link">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="rv-drop-hint">PDF files only · Max 5MB</p>
                    </div>
                  </label>
                  <input
                    id="resume-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    data-testid="file-input"
                  />
                  {selectedFile && (
                    <div className="rv-file-pill">
                      <div
                        className="rv-card-icon"
                        style={{ width: 30, height: 30 }}
                      >
                        <FileText size={14} color="#2997ff" />
                      </div>
                      <span className="rv-file-name">{selectedFile.name}</span>
                      <span className="rv-file-size">
                        {(selectedFile.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  )}
                </div>
              )}
              <button
                className="rv-btn"
                onClick={handleAnalyze}
                disabled={loading}
                data-testid="analyze-btn"
              >
                {loading ? "Analyzing…" : "Analyze Resume"}
              </button>
            </div>

            <div>
              {result ? (
                <div className="rv-results">
                  <div className="rv-card" data-testid="scores-card">
                    <div className="rv-card-header">
                      <div className="rv-card-icon">
                        <TrendingUp size={16} color="#2997ff" />
                      </div>
                      <span className="rv-card-title">Resume Score</span>
                    </div>
                    <p className="rv-card-sub">ML-powered quality assessment</p>
                    <div className="rv-divider" />
                    <div className="rv-score-box">
                      <div className="rv-score-ring">
                        <span
                          className="rv-score-num"
                          style={{
                            color: getScoreColor(result.resume_score || 0),
                          }}
                          data-testid="resume-score"
                        >
                          {result.resume_score || 0}
                        </span>
                        <span className="rv-score-denom">/100</span>
                      </div>
                      <div className="rv-score-label">Resume Score</div>
                      <div
                        className="rv-score-feedback"
                        style={{
                          color: getScoreColor(result.resume_score || 0),
                        }}
                      >
                        {result.feedback}
                      </div>
                      <div className="rv-prog-track">
                        <div
                          className="rv-prog-fill"
                          style={{
                            width: `${result.resume_score || 0}%`,
                            background: `linear-gradient(90deg, ${getScoreColor(result.resume_score || 0)}, #5ac8fa)`,
                          }}
                        />
                      </div>
                      <div className="rv-stats">
                        <div className="rv-stat">
                          <div className="rv-stat-val">
                            {result.analysis?.word_count || 0}
                          </div>
                          <div className="rv-stat-lbl">Words</div>
                        </div>
                        <div className="rv-stat">
                          <div className="rv-stat-val">
                            {result.analysis?.skills_count || 0}
                          </div>
                          <div className="rv-stat-lbl">Skills Found</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rv-card" data-testid="skills-card">
                    <div className="rv-card-header">
                      <div className="rv-card-icon">
                        <CheckCircle size={16} color="#2997ff" />
                      </div>
                      <span className="rv-card-title">
                        Detected Skills{" "}
                        <span
                          style={{
                            color: "var(--rv-text-3)",
                            fontWeight: 400,
                            marginLeft: 6,
                          }}
                        >
                          ({result.skills?.length || 0})
                        </span>
                      </span>
                    </div>
                    <div className="rv-divider" />
                    <div>
                      {result.skills?.length > 0 ? (
                        result.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rv-skill-chip"
                            data-testid={`skill-${idx}`}
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p
                          style={{
                            color: "var(--rv-no-skills-color)",
                            fontSize: "13px",
                            lineHeight: "1.6",
                          }}
                        >
                          No specific skills detected. Consider adding more
                          technical skills to your resume.
                        </p>
                      )}
                    </div>
                  </div>

                  {result.bias_detected?.length > 0 && (
                    <div className="rv-warn-card" data-testid="bias-card">
                      <div className="rv-warn-header">
                        <AlertTriangle size={14} />
                        Bias Detected
                      </div>
                      <div>
                        {result.bias_detected.map((word, idx) => (
                          <span
                            key={idx}
                            className="rv-bias-chip"
                            data-testid={`bias-${idx}`}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                      <p className="rv-warn-note">
                        Consider removing gendered language to improve
                        inclusivity and avoid potential bias.
                      </p>
                    </div>
                  )}

                  <div className="rv-card" data-testid="tips-card">
                    <div className="rv-card-header">
                      <div className="rv-card-icon rv-card-icon-warn">
                        <Lightbulb size={16} color="#fbbf24" />
                      </div>
                      <span className="rv-card-title">Recommended Courses</span>
                    </div>
                    <div className="rv-divider" />
                    {result.courses?.length > 0 ? (
                      <div className="rv-course-grid">
                        {result.courses.slice(0, 4).map((course, idx) => (
                          <a
                            key={idx}
                            href={course.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rv-course"
                            data-testid={`course-card-${idx}`}
                          >
                            <img
                              className="rv-course-img"
                              src={
                                course.thumbnail ||
                                "https://via.placeholder.com/300x170?text=Course"
                              }
                              alt={course.title}
                              onError={(e) => {
                                try {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    "https://via.placeholder.com/300x170?text=Course";
                                } catch (_) {}
                              }}
                            />
                            <div className="rv-course-body">
                              <div className="rv-course-title">
                                {course.title}
                              </div>
                              <div className="rv-course-meta">
                                <span className="rv-course-platform">
                                  {course.platform}
                                </span>
                                <span className="rv-course-price">
                                  {course.price}
                                </span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p
                        style={{ color: "var(--rv-text-4)", fontSize: "13px" }}
                      >
                        No courses available at this time.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rv-card rv-empty">
                  <div className="rv-empty-icon">
                    <FileText size={32} color="var(--rv-text-4)" />
                  </div>
                  <div className="rv-empty-title">No Analysis Yet</div>
                  <p className="rv-empty-sub">
                    Paste your resume text or upload a PDF and click Analyze to
                    get instant feedback.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeValidator;
