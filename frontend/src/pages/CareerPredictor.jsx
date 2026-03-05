import React, { useState } from "react";
import { axiosInstance } from "@/App";
import { toast } from "sonner";
import {
  TrendingUp,
  Award,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const CareerPredictor = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    age: 28,
    experience_years: 5,
    education_level: 2,
    num_skills: 8,
    location_tier: 1,
    job_changes: 2,
  });

  // ── ORIGINAL LOGIC UNTOUCHED ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/predict", formData);
      setResult(response.data);
      toast.success("Prediction generated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to generate prediction",
      );
    } finally {
      setLoading(false);
    }
  };

  const getSuccessLevel = (prob) => {
    if (prob >= 80) return { label: "Excellent", color: "#30d158" };
    if (prob >= 60) return { label: "Good", color: "#2997ff" };
    if (prob >= 40) return { label: "Moderate", color: "#ff9f0a" };
    return { label: "Developing", color: "#ff453a" };
  };

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
          --green-dim:rgba(48,209,88,0.12);
          --amber:    #ff9f0a;
          --amber-dim:rgba(255,159,10,0.12);
          --sh-sm: 0 2px 12px rgba(0,0,0,0.4);
          --sh-md: 0 8px 32px rgba(0,0,0,0.5);
          --sh-lg: 0 20px 60px rgba(0,0,0,0.6);
          --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:20px; --r-2xl:28px;
        }

        .cp-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
          color: var(--text-1);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          position: relative;
        }

        /* Subtle top radial glow */
        .cp-root::before {
          content: '';
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(41,151,255,0.08) 0%, rgba(41,151,255,0.02) 45%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        .cp-page {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 88px 32px 100px;
        }
        @media(max-width:768px){ .cp-page { padding: 80px 20px 80px; } }

        /* ── Header ── */
        .cp-header { margin-bottom: 60px; }

        .cp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11.5px; font-weight: 500; color: var(--blue);
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 18px;
        }
        .cp-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--blue); box-shadow: 0 0 8px var(--blue);
        }

        .cp-title {
          font-size: clamp(34px, 5vw, 60px);
          font-weight: 700; letter-spacing: -0.042em; line-height: 1.0;
          color: var(--text-1); margin-bottom: 18px;
        }
        .cp-title em {
          font-style: normal;
          background: linear-gradient(135deg, #2997ff 0%, #5ac8fa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cp-sub {
          font-size: 16px; color: var(--text-2); max-width: 460px;
          line-height: 1.68; font-weight: 400; letter-spacing: -0.01em;
        }

        /* ── Layout ── */
        .cp-layout {
          display: grid; gap: 16px;
        }
        @media(min-width:1024px){
          .cp-layout { grid-template-columns: 1fr 1fr; align-items: start; }
        }

        /* ── Cards ── */
        .cp-card {
          background: var(--bg-1);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          overflow: hidden;
          box-shadow: var(--sh-sm);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .cp-card:hover {
          border-color: var(--border2);
          box-shadow: var(--sh-md);
        }

        .cp-card-top {
          padding: 24px 28px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-2);
          display: flex; align-items: center; gap: 14px;
        }
        .cp-card-icon {
          width: 40px; height: 40px; border-radius: var(--r-md); flex-shrink: 0;
          background: var(--blue-dim);
          border: 1px solid rgba(41,151,255,0.2);
          display: flex; align-items: center; justify-content: center;
        }
        .cp-card-title {
          font-size: 15px; font-weight: 600; letter-spacing: -0.02em;
          color: var(--text-1); margin-bottom: 2px;
        }
        .cp-card-sub {
          font-size: 12px; color: var(--text-3); letter-spacing: -0.01em;
        }

        .cp-card-body { padding: 24px 28px 28px; }

        /* ── Form Fields ── */
        .cp-field-row {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 14px;
        }
        .cp-field { margin-bottom: 14px; }

        .cp-label {
          display: block; font-size: 11px; font-weight: 500;
          color: var(--text-3); letter-spacing: 0.06em;
          text-transform: uppercase; margin-bottom: 7px;
        }

        .cp-input {
          width: 100%; padding: 11px 14px;
          border-radius: var(--r-md); font-size: 14px;
          background: var(--bg-3);
          border: 1px solid var(--border);
          color: var(--text-1); outline: none;
          font-family: 'Inter', sans-serif; font-weight: 400;
          letter-spacing: -0.01em;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .cp-input:focus {
          border-color: var(--blue);
          background: var(--bg-2);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.12);
        }
        .cp-input:hover:not(:focus) { border-color: var(--border2); }
        .cp-input::-webkit-inner-spin-button,
        .cp-input::-webkit-outer-spin-button { opacity: 0.3; }

        .cp-select {
          width: 100%; padding: 11px 36px 11px 14px;
          border-radius: var(--r-md); font-size: 14px;
          background: var(--bg-3);
          border: 1px solid var(--border);
          color: var(--text-1); outline: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-weight: 400;
          letter-spacing: -0.01em;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%232997ff' stroke-width='1.8' stroke-linecap='round' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
        }
        .cp-select:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.12);
          background-color: var(--bg-2);
        }
        .cp-select:hover:not(:focus) { border-color: var(--border2); }
        .cp-select option { background: #1a1a1a; color: var(--text-1); }

        .cp-rule {
          height: 1px; background: var(--border); margin: 20px 0;
        }

        /* ── Submit Button ── */
        .cp-btn {
          width: 100%; padding: 13px 24px;
          border-radius: 980px; border: none; cursor: pointer;
          font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
          font-family: 'Inter', sans-serif;
          background: var(--blue);
          color: white;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: 0 0 24px rgba(41,151,255,0.2);
          position: relative; overflow: hidden;
        }
        .cp-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
          pointer-events: none;
        }
        .cp-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: scale(1.01);
        }
        .cp-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .cp-btn-spinner {
          width: 13px; height: 13px;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: cpSpin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes cpSpin { to { transform: rotate(360deg); } }

        /* ── Empty State ── */
        .cp-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          min-height: 440px; gap: 14px; padding: 48px 32px;
          text-align: center;
        }
        .cp-empty-icon {
          width: 68px; height: 68px; border-radius: var(--r-xl);
          background: var(--bg-2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }
        .cp-empty-title {
          font-size: 17px; font-weight: 600; letter-spacing: -0.02em;
          color: var(--text-2);
        }
        .cp-empty-text {
          font-size: 14px; color: var(--text-3);
          max-width: 240px; line-height: 1.65; letter-spacing: -0.01em;
        }

        /* ── Score Block ── */
        .cp-score-block {
          text-align: center; padding: 32px 24px 24px;
          background: var(--bg-2);
          border-radius: var(--r-lg); border: 1px solid var(--border);
          margin-bottom: 20px; position: relative; overflow: hidden;
        }
        /* Top hairline accent */
        .cp-score-accent {
          position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          border-radius: 1px;
        }
        .cp-score-eyebrow {
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--text-3); margin-bottom: 18px;
        }
        .cp-score-num {
          font-size: 80px; font-weight: 700; line-height: 1;
          letter-spacing: -0.05em; margin-bottom: 6px;
        }
        .cp-score-label {
          font-size: 14px; color: var(--text-3); margin-bottom: 22px;
          font-weight: 400; letter-spacing: -0.01em;
        }
        .cp-score-label strong { font-weight: 600; }
        .cp-bar-track {
          height: 4px; background: var(--bg-4);
          border-radius: 999px; overflow: hidden;
        }
        .cp-bar-fill {
          height: 100%; border-radius: 999px;
          transition: width 1.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Section Heads ── */
        .cp-section-head {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px; padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
        }
        .cp-section-icon {
          width: 24px; height: 24px; border-radius: 7px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .cp-section-label {
          font-size: 13px; font-weight: 600; letter-spacing: -0.015em;
          color: var(--text-1);
        }

        /* ── Factors ── */
        .cp-factor {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 13px; border-radius: var(--r-md);
          background: var(--bg-2); border: 1px solid var(--border);
          margin-bottom: 7px;
          transition: background 0.2s, border-color 0.2s, transform 0.22s;
          cursor: default;
        }
        .cp-factor:hover {
          background: var(--blue-glow);
          border-color: rgba(41,151,255,0.18);
          transform: translateX(3px);
        }
        .cp-factor-num {
          min-width: 22px; height: 22px; border-radius: 6px;
          background: var(--bg-4); color: var(--text-2);
          font-size: 10px; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cp-factor-text {
          font-size: 13px; font-weight: 400; color: var(--text-2);
          text-transform: capitalize; flex: 1; letter-spacing: -0.01em;
        }
        .cp-factor-arrow { color: var(--text-4); flex-shrink: 0; }

        /* ── Recommendations ── */
        .cp-rec {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 13px; border-radius: var(--r-md);
          background: var(--bg-2); border: 1px solid var(--border);
          margin-bottom: 7px;
          transition: border-color 0.2s, background 0.2s;
        }
        .cp-rec:hover {
          border-color: rgba(255,159,10,0.2);
          background: rgba(255,159,10,0.04);
        }
        .cp-rec-icon { color: var(--amber); flex-shrink: 0; margin-top: 1px; }
        .cp-rec-text {
          font-size: 13px; color: var(--text-2);
          line-height: 1.65; letter-spacing: -0.01em;
        }

        .mb20 { margin-bottom: 20px; }

        /* ── Animations ── */
        @keyframes cpFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cp-header { animation: cpFade 0.8s ease both; }
        .cp-layout  { animation: cpFade 0.8s 0.1s ease both; }
      `}</style>

      <div className="cp-root">
        <div className="cp-page" data-testid="career-predictor-page">
          {/* ── Header ── */}
          <div className="cp-header">
            <div className="cp-eyebrow">
              <div className="cp-eyebrow-dot" />
              ML-Powered Prediction
            </div>
            <h1 className="cp-title">
              Career Success
              <br />
              <em>Predictor</em>
            </h1>
            <p className="cp-sub">
              Enter your profile details to predict your career success
              probability using our ML model.
            </p>
          </div>

          <div className="cp-layout">
            {/* ── Form Card ── */}
            <div className="cp-card" data-testid="prediction-form-card">
              <div className="cp-card-top">
                <div className="cp-card-icon">
                  <TrendingUp size={17} color="#2997ff" />
                </div>
                <div>
                  <div className="cp-card-title">Your Profile</div>
                  <div className="cp-card-sub">
                    Fill in your career details below
                  </div>
                </div>
              </div>

              <div className="cp-card-body">
                <form onSubmit={handleSubmit}>
                  <div className="cp-field-row">
                    <div>
                      <label className="cp-label">Age</label>
                      <input
                        type="number"
                        className="cp-input"
                        value={formData.age}
                        min="18"
                        max="70"
                        required
                        data-testid="input-age"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            age: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="cp-label">Experience (yrs)</label>
                      <input
                        type="number"
                        className="cp-input"
                        value={formData.experience_years}
                        min="0"
                        max="50"
                        required
                        data-testid="input-experience"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience_years: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Education Level</label>
                    <select
                      className="cp-select"
                      value={formData.education_level}
                      data-testid="input-education"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education_level: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="1">High School</option>
                      <option value="2">Bachelor's Degree</option>
                      <option value="3">Master's Degree</option>
                      <option value="4">PhD</option>
                    </select>
                  </div>

                  <div className="cp-field-row">
                    <div>
                      <label className="cp-label">Skills Count</label>
                      <input
                        type="number"
                        className="cp-input"
                        value={formData.num_skills}
                        min="1"
                        max="30"
                        required
                        data-testid="input-skills"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            num_skills: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="cp-label">Location Tier</label>
                      <select
                        className="cp-select"
                        value={formData.location_tier}
                        data-testid="input-location"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location_tier: parseInt(e.target.value),
                          })
                        }
                      >
                        <option value="1">Tier 1 (Major City)</option>
                        <option value="2">Tier 2 (Mid-size City)</option>
                        <option value="3">Tier 3 (Small City)</option>
                      </select>
                    </div>
                  </div>

                  <div className="cp-field">
                    <label className="cp-label">Job Changes</label>
                    <input
                      type="number"
                      className="cp-input"
                      value={formData.job_changes}
                      min="0"
                      max="20"
                      required
                      data-testid="input-job-changes"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          job_changes: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="cp-rule" />

                  <button
                    type="submit"
                    className="cp-btn"
                    disabled={loading}
                    data-testid="predict-btn"
                  >
                    {loading ? (
                      <>
                        <div className="cp-btn-spinner" />
                        Predicting…
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        Predict My Success
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Results Panel ── */}
            <div>
              {result ? (
                <div className="cp-card" data-testid="result-card">
                  <div className="cp-card-top">
                    <div className="cp-card-icon">
                      <Award size={17} color="#2997ff" />
                    </div>
                    <div>
                      <div className="cp-card-title">Success Prediction</div>
                      <div className="cp-card-sub">
                        Your ML-generated career analysis
                      </div>
                    </div>
                  </div>

                  <div className="cp-card-body">
                    {/* Score */}
                    <div className="cp-score-block">
                      <div
                        className="cp-score-accent"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${getSuccessLevel(result.success_probability).color}, transparent)`,
                        }}
                      />
                      <div className="cp-score-eyebrow">
                        Success Probability
                      </div>
                      <div
                        className="cp-score-num"
                        style={{
                          color: getSuccessLevel(result.success_probability)
                            .color,
                        }}
                        data-testid="success-probability"
                      >
                        {result.success_probability}%
                      </div>
                      <div className="cp-score-label">
                        <strong
                          style={{
                            color: getSuccessLevel(result.success_probability)
                              .color,
                          }}
                        >
                          {getSuccessLevel(result.success_probability).label}
                        </strong>{" "}
                        Potential
                      </div>
                      <div
                        className="cp-bar-track"
                        data-testid="success-progress"
                      >
                        <div
                          className="cp-bar-fill"
                          style={{
                            width: `${result.success_probability}%`,
                            background: `linear-gradient(90deg, ${getSuccessLevel(result.success_probability).color}, #5ac8fa)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Top Factors */}
                    {result.top_factors?.length > 0 && (
                      <div className="mb20">
                        <div className="cp-section-head">
                          <div
                            className="cp-section-icon"
                            style={{ background: "var(--blue-dim)" }}
                          >
                            <BarChart3 size={12} color="#2997ff" />
                          </div>
                          <span className="cp-section-label">
                            Top Influencing Factors
                          </span>
                        </div>
                        {result.top_factors.map((factor, idx) => (
                          <div
                            key={idx}
                            className="cp-factor"
                            data-testid={`factor-${idx}`}
                          >
                            <div className="cp-factor-num">{idx + 1}</div>
                            <span className="cp-factor-text">
                              {factor.replace(/_/g, " ")}
                            </span>
                            <ArrowRight size={11} className="cp-factor-arrow" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations?.length > 0 && (
                      <div>
                        <div className="cp-section-head">
                          <div
                            className="cp-section-icon"
                            style={{ background: "var(--amber-dim)" }}
                          >
                            <Lightbulb size={12} color="#ff9f0a" />
                          </div>
                          <span className="cp-section-label">
                            Recommendations
                          </span>
                        </div>
                        {result.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="cp-rec"
                            data-testid={`recommendation-${idx}`}
                          >
                            <CheckCircle2 size={15} className="cp-rec-icon" />
                            <span className="cp-rec-text">{rec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="cp-card cp-empty"
                  style={{ minHeight: "480px" }}
                >
                  <div className="cp-empty-icon">
                    <TrendingUp size={26} color="#3d3d40" />
                  </div>
                  <div className="cp-empty-title">Awaiting Analysis</div>
                  <p className="cp-empty-text">
                    Complete your profile on the left and run the predictor to
                    see your results here.
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

export default CareerPredictor;
