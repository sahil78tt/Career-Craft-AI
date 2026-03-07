import React, { useState, useRef, useEffect } from "react";
import chatBotIcon from "../../assets/chatbot.png";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi 👋 I'm your AI Career Advisor. I can help you with career roadmap, resume, skills, and job guidance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggestedQuestions = [
    "Give me a roadmap to become a Full Stack Developer",
    "What skills should I learn for AI/ML?",
    "How can I improve my resume for tech jobs?",
    "Suggest career options based on my skills",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customMessage = null) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await res.json();
      console.log("AI RESPONSE:", data);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            data.reply ||
            data.response ||
            data.message ||
            "No response from AI",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "AI Assistant is not responding right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Dark (default) ── */
        :root, [data-theme="dark"] {
          --ai-panel-bg:          #0a0a0a;
          --ai-panel-border:      rgba(255,255,255,0.1);
          --ai-panel-shadow:      0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
          --ai-header-bg:         rgba(255,255,255,0.02);
          --ai-header-border:     rgba(255,255,255,0.07);
          --ai-name-color:        #f5f5f7;
          --ai-status-color:      #34d399;
          --ai-close-color:       #6e6e73;
          --ai-close-hover-color: #f5f5f7;
          --ai-close-hover-bg:    rgba(255,255,255,0.07);
          --ai-scroll-thumb:      rgba(255,255,255,0.08);
          --ai-bubble-ai-bg:      rgba(255,255,255,0.05);
          --ai-bubble-ai-border:  rgba(255,255,255,0.08);
          --ai-bubble-ai-color:   #f5f5f7;
          --ai-typing-bg:         rgba(255,255,255,0.05);
          --ai-typing-border:     rgba(255,255,255,0.08);
          --ai-sugg-label-color:  #3a3a3c;
          --ai-sugg-btn-border:   rgba(255,255,255,0.09);
          --ai-sugg-btn-bg:       rgba(255,255,255,0.03);
          --ai-sugg-btn-color:    #6e6e73;
          --ai-sugg-btn-hover-border: rgba(41,151,255,0.3);
          --ai-sugg-btn-hover-color:  #2997ff;
          --ai-sugg-btn-hover-bg:     rgba(41,151,255,0.06);
          --ai-input-row-border:  rgba(255,255,255,0.07);
          --ai-input-wrap-bg:     rgba(255,255,255,0.05);
          --ai-input-wrap-border: rgba(255,255,255,0.09);
          --ai-input-focus-border:rgba(41,151,255,0.4);
          --ai-input-focus-shadow:rgba(41,151,255,0.08);
          --ai-input-color:       #f5f5f7;
          --ai-input-placeholder: #3a3a3c;
          --ai-fab-ring-border:   rgba(41,151,255,0.3);
        }

        /* ── Light ── */
        [data-theme="light"] {
          --ai-panel-bg:          #ffffff;
          --ai-panel-border:      rgba(0,0,0,0.1);
          --ai-panel-shadow:      0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04);
          --ai-header-bg:         rgba(0,0,0,0.02);
          --ai-header-border:     rgba(0,0,0,0.08);
          --ai-name-color:        #1e293b;
          --ai-status-color:      #22c55e;
          --ai-close-color:       #94a3b8;
          --ai-close-hover-color: #1e293b;
          --ai-close-hover-bg:    rgba(0,0,0,0.06);
          --ai-scroll-thumb:      rgba(0,0,0,0.1);
          --ai-bubble-ai-bg:      #f0f4f8;
          --ai-bubble-ai-border:  rgba(0,0,0,0.08);
          --ai-bubble-ai-color:   #1e293b;
          --ai-typing-bg:         #f0f4f8;
          --ai-typing-border:     rgba(0,0,0,0.08);
          --ai-sugg-label-color:  #94a3b8;
          --ai-sugg-btn-border:   rgba(0,0,0,0.09);
          --ai-sugg-btn-bg:       rgba(0,0,0,0.03);
          --ai-sugg-btn-color:    #64748b;
          --ai-sugg-btn-hover-border: rgba(41,151,255,0.3);
          --ai-sugg-btn-hover-color:  #2997ff;
          --ai-sugg-btn-hover-bg:     rgba(41,151,255,0.07);
          --ai-input-row-border:  rgba(0,0,0,0.08);
          --ai-input-wrap-bg:     rgba(0,0,0,0.03);
          --ai-input-wrap-border: rgba(0,0,0,0.1);
          --ai-input-focus-border:rgba(41,151,255,0.4);
          --ai-input-focus-shadow:rgba(41,151,255,0.08);
          --ai-input-color:       #1e293b;
          --ai-input-placeholder: #94a3b8;
          --ai-fab-ring-border:   rgba(41,151,255,0.3);
        }

        /* FAB */
        .ai-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          width: 54px; height: 54px; border-radius: 16px; border: none; cursor: pointer;
          background: #2997ff;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
          box-shadow: 0 4px 15px rgba(41,151,255,0.25);
          transition: all 0.3s ease;
          font-family: -apple-system, sans-serif;
        }
        .ai-fab:hover {
          transform: scale(1.07) translateY(-2px);
          box-shadow: 0 12px 40px rgba(41,151,255,0.35);
          background: #2484e0;
        }
        .ai-fab-ring {
          position: fixed; bottom: 28px; right: 28px; z-index: 9998;
          width: 54px; height: 54px; border-radius: 16px;
          border: 1px solid var(--ai-fab-ring-border);
          animation: aiFabPulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes aiFabPulse {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.18); opacity: 0; }
        }

        /* Panel */
        .ai-panel {
          position: fixed; bottom: 96px; right: 28px; z-index: 9999;
          width: 368px;
          border-radius: 22px; overflow: hidden;
          background: var(--ai-panel-bg);
          border: 1px solid var(--ai-panel-border);
          box-shadow: var(--ai-panel-shadow);
          display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
          animation: aiSlideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        @keyframes aiSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Header */
        .ai-header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px 15px;
          background: var(--ai-header-bg);
          border-bottom: 1px solid var(--ai-header-border);
          transition: background 0.3s, border-color 0.3s;
        }
        .ai-avatar {
          width: 54px; height: 54px; border-radius: 14px;
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(41,151,255,0.3);
          overflow: hidden;
        }
        .ai-header-info { flex: 1; }
        .ai-header-name {
          font-size: 14px; font-weight: 600; color: var(--ai-name-color);
          letter-spacing: -0.01em; line-height: 1;
          transition: color 0.3s;
        }
        .ai-header-status {
          display: flex; align-items: center; gap: 5px; margin-top: 4px;
        }
        .ai-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--ai-status-color);
          animation: aiPulse 2.5s ease-in-out infinite;
        }
        @keyframes aiPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .ai-status-text {
          font-size: 11px; color: var(--ai-status-color);
          font-weight: 500; transition: color 0.3s;
        }
        .ai-close {
          background: none; border: none; cursor: pointer;
          color: var(--ai-close-color);
          padding: 6px; border-radius: 8px; line-height: 0;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .ai-close:hover {
          color: var(--ai-close-hover-color);
          background: var(--ai-close-hover-bg);
        }

        /* Messages */
        .ai-messages {
          height: 290px; overflow-y: auto;
          padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }
        .ai-messages::-webkit-scrollbar { width: 3px; }
        .ai-messages::-webkit-scrollbar-track { background: transparent; }
        .ai-messages::-webkit-scrollbar-thumb {
          background: var(--ai-scroll-thumb); border-radius: 999px;
        }

        .ai-msg { display: flex; }
        .ai-msg.user { justify-content: flex-end; }
        .ai-msg.ai   { justify-content: flex-start; }
        .ai-bubble {
          max-width: 82%; padding: 10px 14px; border-radius: 16px;
          font-size: 13px; line-height: 1.6;
          transition: background 0.3s, border-color 0.3s, color 0.3s;
        }
        .ai-bubble.user {
          background: #2997ff; color: #ffffff; font-weight: 500;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px rgba(41,151,255,0.25);
        }
        .ai-bubble.ai {
          background: var(--ai-bubble-ai-bg);
          border: 1px solid var(--ai-bubble-ai-border);
          color: var(--ai-bubble-ai-color);
          border-bottom-left-radius: 4px;
        }

        /* Typing indicator */
        .ai-typing {
          display: flex; align-items: center; gap: 4px;
          padding: 12px 14px;
          background: var(--ai-typing-bg);
          border: 1px solid var(--ai-typing-border);
          border-radius: 16px; border-bottom-left-radius: 4px;
          width: fit-content;
          transition: background 0.3s, border-color 0.3s;
        }
        .ai-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #2997ff;
          animation: aiBounce 1.2s ease-in-out infinite;
        }
        .ai-dot:nth-child(2) { animation-delay: 0.2s; }
        .ai-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aiBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

        /* Suggestions */
        .ai-suggestions {
          padding: 0 14px 12px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .ai-suggestion-label {
          width: 100%; font-size: 11px; color: var(--ai-sugg-label-color);
          letter-spacing: 0.02em; margin-bottom: 2px;
          transition: color 0.3s;
        }
        .ai-suggestion-btn {
          padding: 6px 11px; border-radius: 999px;
          border: 1px solid var(--ai-sugg-btn-border);
          background: var(--ai-sugg-btn-bg);
          color: var(--ai-sugg-btn-color);
          font-size: 11px; cursor: pointer; font-family: inherit;
          text-align: left;
          transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
          line-height: 1.4;
        }
        .ai-suggestion-btn:hover {
          border-color: var(--ai-sugg-btn-hover-border);
          color: var(--ai-sugg-btn-hover-color);
          background: var(--ai-sugg-btn-hover-bg);
        }

        /* Input row */
        .ai-input-row {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 14px;
          border-top: 1px solid var(--ai-input-row-border);
          transition: border-color 0.3s;
        }
        .ai-input-wrap {
          flex: 1; display: flex; align-items: center;
          background: var(--ai-input-wrap-bg);
          border: 1px solid var(--ai-input-wrap-border);
          border-radius: 12px; padding: 0 12px; gap: 8px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.3s;
        }
        .ai-input-wrap:focus-within {
          border-color: var(--ai-input-focus-border);
          box-shadow: 0 0 0 3px var(--ai-input-focus-shadow);
        }
        .ai-input {
          flex: 1; background: transparent; border: none; outline: none;
          padding: 10px 0; font-size: 13px;
          color: var(--ai-input-color);
          font-family: inherit;
          transition: color 0.3s;
        }
        .ai-input::placeholder { color: var(--ai-input-placeholder); }
        .ai-send {
          width: 32px; height: 32px; border-radius: 10px; border: none; cursor: pointer;
          background: #2997ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(41,151,255,0.3);
        }
        .ai-send:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(41,151,255,0.45);
          background: #2484e0;
        }
        .ai-send:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-panel">
          <div className="ai-header">
            <div className="ai-avatar">
              <img
                src={chatBotIcon}
                alt="AI"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="ai-header-info">
              <div className="ai-header-name">AI Career Advisor</div>
              <div className="ai-header-status">
                <div className="ai-status-dot" />
                <span className="ai-status-text">Online</span>
              </div>
            </div>
            <button className="ai-close" onClick={() => setIsOpen(false)}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-msg ${msg.role}`}>
                <div className={`ai-bubble ${msg.role}`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai">
                <div className="ai-typing">
                  <div className="ai-dot" />
                  <div className="ai-dot" />
                  <div className="ai-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="ai-suggestions">
              <span className="ai-suggestion-label">Try asking</span>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="ai-suggestion-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="ai-input-row">
            <div className="ai-input-wrap">
              <input
                className="ai-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about career, skills, roadmap…"
              />
            </div>
            <button
              className="ai-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1 6.5H12M7 1.5L12 6.5L7 11.5"
                  stroke="#ffffff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      {!isOpen && <div className="ai-fab-ring" />}
      <button className="ai-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <img
            src={chatBotIcon}
            alt="AI"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        )}
      </button>
    </>
  );
};

export default AIAssistant;
