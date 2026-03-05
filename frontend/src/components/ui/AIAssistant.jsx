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
        .ai-fab {
          position: fixed; bottom: 28px; right: 28px; z-index: 9999;
          width: 54px; height: 54px; border-radius: 16px; border: none; cursor: pointer;
          background: #2997ff;
          display: flex; align-items: center; justify-content: center; font-size: 20px;
box-shadow: 0 4px 15px rgba(41,151,255,0.25);          transition: all 0.3s ease;
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
          border: 1px solid rgba(41,151,255,0.3);
          animation: aiFabPulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes aiFabPulse {
          0%,100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.18); opacity: 0; }
        }

        .ai-panel {
          position: fixed; bottom: 96px; right: 28px; z-index: 9999;
          width: 368px;
          border-radius: 22px; overflow: hidden;
          background: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
          display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
          animation: aiSlideUp 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes aiSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .ai-header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 18px 15px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .ai-avatar {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2997ff, #5ac8fa);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(41,151,255,0.3);
  overflow: hidden;
}
        .ai-header-info { flex: 1; }
        .ai-header-name {
          font-size: 14px; font-weight: 600; color: #f5f5f7;
          letter-spacing: -0.01em; line-height: 1;
        }
        .ai-header-status {
          display: flex; align-items: center; gap: 5px; margin-top: 4px;
        }
        .ai-status-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #34d399;
          animation: aiPulse 2.5s ease-in-out infinite;
        }
        @keyframes aiPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .ai-status-text { font-size: 11px; color: #34d399; font-weight: 500; }
        .ai-close {
          background: none; border: none; cursor: pointer; color: #6e6e73;
          padding: 6px; border-radius: 8px; line-height: 0;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .ai-close:hover { color: #f5f5f7; background: rgba(255,255,255,0.07); }

        .ai-messages {
          height: 290px; overflow-y: auto;
          padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }
        .ai-messages::-webkit-scrollbar { width: 3px; }
        .ai-messages::-webkit-scrollbar-track { background: transparent; }
        .ai-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 999px; }

        .ai-msg { display: flex; }
        .ai-msg.user { justify-content: flex-end; }
        .ai-msg.ai  { justify-content: flex-start; }
        .ai-bubble {
          max-width: 82%; padding: 10px 14px; border-radius: 16px;
          font-size: 13px; line-height: 1.6;
        }
        .ai-bubble.user {
          background: #2997ff; color: #ffffff; font-weight: 500;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 14px rgba(41,151,255,0.25);
        }
        .ai-bubble.ai {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f5f5f7; border-bottom-left-radius: 4px;
        }

        .ai-typing {
          display: flex; align-items: center; gap: 4px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; border-bottom-left-radius: 4px;
          width: fit-content;
        }
        .ai-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #2997ff;
          animation: aiBounce 1.2s ease-in-out infinite;
        }
        .ai-dot:nth-child(2) { animation-delay: 0.2s; }
        .ai-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aiBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

        .ai-suggestions {
          padding: 0 14px 12px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .ai-suggestion-label {
          width: 100%; font-size: 11px; color: #3a3a3c;
          letter-spacing: 0.02em; margin-bottom: 2px;
        }
        .ai-suggestion-btn {
          padding: 6px 11px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03); color: #6e6e73;
          font-size: 11px; cursor: pointer; font-family: inherit;
          text-align: left; transition: all 0.2s ease;
          line-height: 1.4;
        }
        .ai-suggestion-btn:hover {
          border-color: rgba(41,151,255,0.3);
          color: #2997ff;
          background: rgba(41,151,255,0.06);
        }

        .ai-input-row {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .ai-input-wrap {
          flex: 1; display: flex; align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; padding: 0 12px; gap: 8px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ai-input-wrap:focus-within {
          border-color: rgba(41,151,255,0.4);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.08);
        }
        .ai-input {
          flex: 1; background: transparent; border: none; outline: none;
          padding: 10px 0; font-size: 13px; color: #f5f5f7;
          font-family: inherit;
        }
        .ai-input::placeholder { color: #3a3a3c; }
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
              <div className="ai-avatar">
                <img
                  src={chatBotIcon}
                  alt="AI"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
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
