import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function Chat({ videoId, sessionId }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: "bot",
      text: "Hi! I watched the video you shared. Ask me any question about grammar, vocabulary, expressions or culture related to the video.",
    },
  ]);
  const [chatUserInput, setChatUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    const input = chatUserInput.trim();
    if (!input || isLoading) return;

    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setChatUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, video_id: videoId, session_id: sessionId }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Something went wrong.");
      }
      const result = await response.json();
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: result }]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: err.message || "Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-space">
        {messages.map((message) => (
          <div
            className={message.sender === "bot" ? "message bot" : "message user"}
            key={message.id}
          >
            <p>{message.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <p>...</p>
          </div>
        )}
      </div>
      <div className="input-space">
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <input
            placeholder="Ask a question about the video..."
            value={chatUserInput}
            onChange={(e) => setChatUserInput(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            Explain
          </button>
        </form>
      </div>
    </div>
  );
}
export default Chat;
