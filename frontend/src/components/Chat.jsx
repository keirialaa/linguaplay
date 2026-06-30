import { useState } from "react";

function Chat({ videoId }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I watched the video you shared. Ask me any question about grammar, vocabulary, expressions or culture related to the video.",
    },
  ]);
  const [chatUserInput, setChatUserInput] = useState("");

  return (
    <div className="chat-container">
      <div className="chat-space">
        {messages.map((message, i) => (
          <div
            className={message.sender == "bot" ? "message bot" : "message user"}
            key={i}
          >
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="input-space">
        <form className="chat-input">
          <input
            placeholder="Ask a question about the video..."
            value={chatUserInput}
            onChange={(e) => setChatUserInput(e.target.value)}
          ></input>
          <button
            type="button"
            onClick={async () => {
              const newUserMessage = { sender: "user", text: chatUserInput };
              setMessages((prev) => [...prev, newUserMessage]);
              setChatUserInput("");
              const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text: chatUserInput,
                  video_id: videoId,
                }),
              });
              const result = await response.json();
              const newBotMessage = { sender: "bot", text: result };
              setMessages((prev) => [...prev, newBotMessage]);
            }}
          >
            Explain
          </button>
        </form>
      </div>
    </div>
  );
}
export default Chat;
