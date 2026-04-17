// client/src/Components/Chatbot/Chatbot.js
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const SESSION_ID = generateSessionId();

const MESSAGE_SUGGESTIONS = [
  "Quelles destinations proposez-vous ?",
  "Avez-vous des promotions ?",
  "Comment faire une réservation ?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Bonjour ! 👋 Je suis l'assistant de Miha Travel. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        { message: userText, sessionId: SESSION_ID }
      );
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        .chat-bubble-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a73e8, #0d47a1);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(26,115,232,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .chat-bubble-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 24px rgba(26,115,232,0.55);
        }
        .chat-bubble-btn svg { color: white; }

        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 28px;
          width: 360px;
          max-height: 520px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          z-index: 999;
          overflow: hidden;
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chat-header {
          background: linear-gradient(135deg, #1a73e8, #0d47a1);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-header-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .chat-header-info { flex: 1; }
        .chat-header-name {
          color: white;
          font-weight: 600;
          font-size: 15px;
          margin: 0;
        }
        .chat-header-status {
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .status-dot {
          width: 7px;
          height: 7px;
          background: #4cef8a;
          border-radius: 50%;
          display: inline-block;
        }
        .chat-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.8);
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .chat-close-btn:hover { color: white; }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8f9fb;
          max-height: 320px;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }

        .msg {
          display: flex;
          flex-direction: column;
          max-width: 82%;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .msg.user { align-self: flex-end; align-items: flex-end; }
        .msg.assistant { align-self: flex-start; align-items: flex-start; }

        .msg-bubble {
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .msg.user .msg-bubble {
          background: linear-gradient(135deg, #1a73e8, #0d47a1);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .msg.assistant .msg-bubble {
          background: white;
          color: #333;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: white;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          width: fit-content;
        }
        .typing-dot {
          width: 7px;
          height: 7px;
          background: #aaa;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .chat-suggestions {
          padding: 8px 16px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          background: #f8f9fb;
          border-top: 1px solid #eee;
        }
        .suggestion-btn {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          color: #1a73e8;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, border-color 0.15s;
        }
        .suggestion-btn:hover { background: #e8f0fe; border-color: #1a73e8; }

        .chat-input-area {
          padding: 12px 16px;
          display: flex;
          gap: 8px;
          background: white;
          border-top: 1px solid #eee;
          align-items: flex-end;
        }
        .chat-input {
          flex: 1;
          border: 1.5px solid #e0e0e0;
          border-radius: 12px;
          padding: 9px 14px;
          font-size: 14px;
          outline: none;
          resize: none;
          max-height: 80px;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .chat-input:focus { border-color: #1a73e8; }
        .chat-send-btn {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #1a73e8, #0d47a1);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-send-btn svg { color: white; }

        @media (max-width: 480px) {
          .chat-window { width: calc(100vw - 32px); right: 16px; bottom: 90px; }
        }
      `}</style>

      {/* Bouton flottant */}
      <button
        className="chat-bubble-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le chat"
      >
        {open ? (
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {/* Fenêtre de chat */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-avatar">✈️</div>
            <div className="chat-header-info">
              <p className="chat-header-name">Assistant Miha Travel</p>
              <span className="chat-header-status">
                <span className="status-dot" /> En ligne
              </span>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg assistant">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides */}
          {messages.length <= 2 && (
            <div className="chat-suggestions">
              {MESSAGE_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion-btn"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Zone de saisie */}
          <div className="chat-input-area">
            <textarea
              className="chat-input"
              rows={1}
              placeholder="Écrivez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Envoyer"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}