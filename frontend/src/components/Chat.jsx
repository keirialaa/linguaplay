import { useState, useRef } from "react";
import QuizMessage from "./QuizMessage";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? "";

// Whisper returns full language names (e.g. "german"), not ISO codes
const WHISPER_TO_BCP47 = {
  afrikaans: "af-ZA", arabic: "ar-SA", bulgarian: "bg-BG", catalan: "ca-ES",
  czech: "cs-CZ", welsh: "cy-GB", danish: "da-DK", german: "de-DE",
  greek: "el-GR", english: "en-US", spanish: "es-ES", estonian: "et-EE",
  persian: "fa-IR", finnish: "fi-FI", french: "fr-FR", irish: "ga-IE",
  galician: "gl-ES", hebrew: "he-IL", hindi: "hi-IN", croatian: "hr-HR",
  hungarian: "hu-HU", armenian: "hy-AM", indonesian: "id-ID", icelandic: "is-IS",
  italian: "it-IT", japanese: "ja-JP", georgian: "ka-GE", kazakh: "kk-KZ",
  korean: "ko-KR", lithuanian: "lt-LT", latvian: "lv-LV", macedonian: "mk-MK",
  malay: "ms-MY", dutch: "nl-NL", norwegian: "nb-NO", polish: "pl-PL",
  portuguese: "pt-PT", romanian: "ro-RO", russian: "ru-RU", slovak: "sk-SK",
  slovenian: "sl-SI", albanian: "sq-AL", serbian: "sr-RS", swedish: "sv-SE",
  swahili: "sw-KE", thai: "th-TH", turkish: "tr-TR", ukrainian: "uk-UA",
  urdu: "ur-PK", vietnamese: "vi-VN", chinese: "zh-CN",
};

const LANG_LABEL = {
  german: "DE", french: "FR", spanish: "ES", italian: "IT", portuguese: "PT",
  dutch: "NL", russian: "RU", polish: "PL", swedish: "SV", norwegian: "NO",
  danish: "DA", finnish: "FI", czech: "CS", hungarian: "HU", romanian: "RO",
  ukrainian: "UK", turkish: "TR", arabic: "AR", hebrew: "HE", hindi: "HI",
  japanese: "JA", korean: "KO", chinese: "ZH", vietnamese: "VI", thai: "TH",
  indonesian: "ID", malay: "MS", greek: "EL", bulgarian: "BG", croatian: "HR",
  slovak: "SK", slovenian: "SL", serbian: "SR", catalan: "CA", galician: "GL",
  icelandic: "IS", latvian: "LV", lithuanian: "LT", estonian: "ET",
  albanian: "SQ", macedonian: "MK", armenian: "HY", georgian: "KA",
  kazakh: "KK", swahili: "SW", afrikaans: "AF", welsh: "CY", irish: "GA",
  persian: "FA", urdu: "UR",
};

function Chat({ videoId, sessionId, language }) {
  const [messages, setMessages] = useState([
    {
      id: 0,
      sender: "bot",
      type: "text",
      text: "Hi! I watched the video you shared. Ask me any question about grammar, vocabulary, expressions or culture related to the video.",
    },
  ]);
  const [chatUserInput, setChatUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listeningLang, setListeningLang] = useState(null);
  const recognitionRef = useRef(null);

  const videoLangBcp47 = language ? WHISPER_TO_BCP47[language.toLowerCase()] : null;
  const showVideoMic = videoLangBcp47 && language.toLowerCase() !== "english";

  const startListening = (bcp47) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (listeningLang) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = bcp47;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListeningLang(bcp47);
    recognition.onend = () => setListeningLang(null);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setChatUserInput(transcript);
    };

    recognition.start();
  };

  const sendMessage = async () => {
    const input = chatUserInput.trim();
    if (!input || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      type: "text",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-App-Password": APP_PASSWORD },
        body: JSON.stringify({
          text: input,
          video_id: videoId,
          session_id: sessionId,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Something went wrong.");
      }
      const result = await response.json();
      if (result.type === "text") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            type: "text",
            text: result.data,
          },
        ]);
      } else if (result.type === "quiz") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "bot",
            type: "quiz",
            data: result.data,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: err.message || "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-space">
        {messages.map((message) =>
          message.type === "quiz" ? (
            <QuizMessage
              key={message.id}
              quiz={message.data}
              onClose={() => setMessages((prev) => prev.filter((m) => m.id !== message.id))}
            />
          ) : (
            <div
              className={
                message.sender === "bot" ? "message bot" : "message user"
              }
              key={message.id}
            >
              <p>{message.text}</p>
            </div>
          ),
        )}
      </div>
      <div className="input-space">
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            placeholder="Ask a question about the video..."
            value={chatUserInput}
            onChange={(e) => setChatUserInput(e.target.value)}
          />
          <button
            type="button"
            className={`mic-button ${listeningLang === "en-US" ? "mic-listening" : ""}`}
            onClick={() => startListening("en-US")}
            title={listeningLang === "en-US" ? "Stop listening" : "Speak in English"}
          >
            🎤 EN
          </button>
          {showVideoMic && (
            <button
              type="button"
              className={`mic-button ${listeningLang === videoLangBcp47 ? "mic-listening" : ""}`}
              onClick={() => startListening(videoLangBcp47)}
              title={listeningLang === videoLangBcp47 ? "Stop listening" : `Speak in ${LANG_LABEL[language.toLowerCase()] ?? language.toUpperCase()}`}
            >
              🎤 {LANG_LABEL[language.toLowerCase()] ?? language.toUpperCase()}
            </button>
          )}
          <button type="submit" disabled={isLoading}>
            Explain
          </button>
        </form>
      </div>
    </div>
  );
}
export default Chat;
