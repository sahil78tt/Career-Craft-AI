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
        localStorage.setItem("last_resume_analysis", JSON.stringify(response.data));
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
        .rv-root {
          min-height: 100vh;
          background: #000000;
          padding: 100px 24px 80px;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }
        .rv-glow-top {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(41,151,255,0.08) 0%, transparent 65%);
          pointer-events: none;
        }
        .rv-glow-accent {
          position: absolute;
          top: 200px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(90,200,250,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        @keyframes rvPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.85)} }
        @keyframes rvPageIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rv-inner {
          max-width: 1160px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          animation: rvPageIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .rv-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(41,151,255,0.1);
          border: 1px solid rgba(41,151,255,0.2);
          color: #2997ff;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-bottom: 20px;
        }
        .rv-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2997ff;
          animation: rvPulse 2.5s ease-in-out infinite;
        }
        .rv-title {
          font-size: clamp(32px, 4.5vw, 52px);
          font-weight: 700;
          color: #f5f5f7;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 14px;
        }
        .rv-title-accent {
          background: linear-gradient(135deg, #2997ff 0%, #5ac8fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .rv-subtitle {
          color: #6e6e73;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.5;
          margin-bottom: 52px;
          max-width: 500px;
        }
        .rv-layout {
          display: grid;
          gap: 24px;
        }
        @media(min-width: 1024px) {
          .rv-layout { grid-template-columns: 1fr 1fr; align-items: start; }
        }
        .rv-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(20px);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .rv-card:hover {
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        }
        .rv-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        .rv-card-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(41,151,255,0.1);
          border: 1px solid rgba(41,151,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rv-card-icon-warn {
          background: rgba(251,191,36,0.1);
          border-color: rgba(251,191,36,0.2);
        }
        .rv-card-title {
          font-size: 17px;
          font-weight: 600;
          color: #f5f5f7;
          letter-spacing: -0.01em;
        }
        .rv-card-sub {
          color: #6e6e73;
          font-size: 13px;
          margin-bottom: 22px;
          padding-left: 50px;
          margin-top: 2px;
        }
        .rv-tabs {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 20px;
          gap: 4px;
        }
        .rv-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-family: inherit;
          letter-spacing: -0.01em;
        }
        .rv-tab-active {
          background: #2997ff;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(41,151,255,0.35);
        }
        .rv-tab-inactive {
          background: transparent;
          color: #6e6e73;
        }
        .rv-tab-inactive:hover {
          color: #a1a1a6;
          background: rgba(255,255,255,0.05);
        }
        .rv-textarea {
          width: 100%;
          min-height: 300px;
          padding: 16px;
          border-radius: 14px;
          font-size: 13px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f5f5f7;
          outline: none;
          resize: vertical;
          transition: border-color 0.2s ease, background 0.2s ease;
          font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
          line-height: 1.7;
          box-sizing: border-box;
        }
        .rv-textarea:focus {
          border-color: rgba(41,151,255,0.4);
          background: rgba(41,151,255,0.03);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.08);
        }
        .rv-textarea::placeholder { color: #3a3a3c; }
        .rv-dropzone {
          border: 1.5px dashed rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 52px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .rv-dropzone-over {
          border-color: rgba(41,151,255,0.5);
          background: rgba(41,151,255,0.04);
        }
        .rv-dropzone:hover {
          border-color: rgba(41,151,255,0.3);
          background: rgba(255,255,255,0.02);
        }
        .rv-drop-icon {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .rv-drop-text {
          color: #a1a1a6;
          font-size: 14px;
          margin-bottom: 6px;
        }
        .rv-drop-link { color: #2997ff; font-weight: 600; }
        .rv-drop-hint { font-size: 12px; color: #3a3a3c; margin-top: 4px; }
        .rv-file-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(41,151,255,0.06);
          border: 1px solid rgba(41,151,255,0.15);
          margin-top: 14px;
        }
        .rv-file-name {
          font-size: 13px;
          font-weight: 500;
          color: #f5f5f7;
          flex: 1;
        }
        .rv-file-size { font-size: 12px; color: #6e6e73; }
        .rv-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          background: #2997ff;
          color: #ffffff;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.25s ease;
          margin-top: 18px;
          position: relative;
          overflow: hidden;
        }
        .rv-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .rv-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(41,151,255,0.4);
          background: #2484e0;
        }
        .rv-btn:active:not(:disabled) { transform: translateY(0); }
        .rv-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .rv-results { display: flex; flex-direction: column; gap: 20px; }
        .rv-score-box {
          text-align: center;
          padding: 32px 24px 24px;
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          margin-top: 8px;
        }
        .rv-score-ring {
          position: relative;
          display: inline-block;
          margin-bottom: 16px;
        }
        .rv-score-num {
          font-size: 72px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .rv-score-denom {
          font-size: 24px;
          color: #3a3a3c;
          font-weight: 400;
        }
        .rv-score-label {
          font-size: 12px;
          color: #6e6e73;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .rv-score-feedback {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 20px;
          line-height: 1.4;
        }
        .rv-prog-track {
          height: 6px;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          overflow: hidden;
        }
        .rv-prog-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .rv-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 16px;
        }
        .rv-stat {
          padding: 14px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .rv-stat-val {
          font-size: 24px;
          font-weight: 700;
          color: #2997ff;
          letter-spacing: -0.02em;
          margin-bottom: 3px;
        }
        .rv-stat-lbl { font-size: 11px; color: #6e6e73; letter-spacing: 0.02em; }
        .rv-skill-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 13px;
          border-radius: 999px;
          background: rgba(41,151,255,0.08);
          border: 1px solid rgba(41,151,255,0.18);
          color: #5ac8fa;
          font-size: 12px;
          font-weight: 500;
          margin: 3px;
          transition: all 0.2s ease;
        }
        .rv-skill-chip:hover {
          background: rgba(41,151,255,0.14);
          border-color: rgba(41,151,255,0.3);
        }
        .rv-bias-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 13px;
          border-radius: 999px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          color: #f87171;
          font-size: 12px;
          font-weight: 500;
          margin: 3px;
        }
        .rv-course-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .rv-course {
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          display: block;
          transition: all 0.3s ease;
        }
        .rv-course:hover {
          border-color: rgba(41,151,255,0.25);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }
        .rv-course-img {
          width: 100%;
          height: 80px;
          object-fit: cover;
          background: #111111;
          display: block;
        }
        .rv-course-body { padding: 10px 12px 12px; }
        .rv-course-title {
          font-size: 12px;
          font-weight: 600;
          color: #f5f5f7;
          margin-bottom: 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.45;
        }
        .rv-course-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rv-course-platform { font-size: 11px; color: #6e6e73; }
        .rv-course-price { font-size: 12px; font-weight: 600; color: #34d399; }
        .rv-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 440px;
          text-align: center;
        }
        .rv-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .rv-empty-title {
          font-size: 17px;
          font-weight: 600;
          color: #a1a1a6;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }
        .rv-empty-sub {
          color: #3a3a3c;
          font-size: 14px;
          line-height: 1.6;
          max-width: 240px;
        }
        .rv-warn-card {
          background: rgba(248,113,113,0.04);
          border: 1px solid rgba(248,113,113,0.14);
          border-radius: 16px;
          padding: 20px;
        }
        .rv-warn-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #f87171;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }
        .rv-warn-note {
          font-size: 12px;
          color: #6e6e73;
          margin-top: 10px;
          line-height: 1.5;
        }
        .rv-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 4px 0 18px;
        }
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
            {/* Input Card */}
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
                        <Upload size={22} color="#6e6e73" />
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

            {/* Results */}
            <div>
              {result ? (
                <div className="rv-results">
                  {/* Score */}
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

                  {/* Skills */}
                  <div className="rv-card" data-testid="skills-card">
                    <div className="rv-card-header">
                      <div className="rv-card-icon">
                        <CheckCircle size={16} color="#2997ff" />
                      </div>
                      <span className="rv-card-title">
                        Detected Skills
                        <span
                          style={{
                            color: "#6e6e73",
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
                            color: "#3a3a3c",
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

                  {/* Bias */}
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

                  {/* Courses */}
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
                      <p style={{ color: "#3a3a3c", fontSize: "13px" }}>
                        No courses available at this time.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rv-card rv-empty">
                  <div className="rv-empty-icon">
                    <FileText size={32} color="#3a3a3c" />
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