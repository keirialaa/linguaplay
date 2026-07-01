import { useState, useId } from "react";
import "./App.css";
import ChatView from "./components/ChatView";
import EntryView from "./components/EntryView";
import ProcessingView from "./components/ProcessingView";

function App() {
  const [stage, setStage] = useState("entry");
  const [processingError, setProcessingError] = useState("");
  const sessionId = useId();
  const [videoId, setVideoId] = useState(null);
  const [title, setTitle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [channel, setChannel] = useState(null);
  const [cefrLevel, setCefrLevel] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [diffDescr, setDiffDescr] = useState(null);
  const [expressions, setExpressions] = useState(null);
  const [cultureNote, setCultureNote] = useState(null);
  const [language, setLanguage] = useState(null);
  const [chunks, setChunks] = useState(null);
  const [vocab, setVocab] = useState(null);

  if (stage === "entry") {
    return (
      <EntryView
        changeStage={setStage}
        setProcessingError={setProcessingError}
        processingError={processingError}
        setVideoId={setVideoId}
        setTitle={setTitle}
        setDuration={setDuration}
        setChannel={setChannel}
        setCefrLevel={setCefrLevel}
        setComplexity={setComplexity}
        setDiffDescr={setDiffDescr}
        setExpressions={setExpressions}
        setCultureNote={setCultureNote}
        setLanguage={setLanguage}
        setChunks={setChunks}
        setVocab={setVocab}
      ></EntryView>
    );
  } else if (stage === "processing") {
    return <ProcessingView changeStage={setStage}></ProcessingView>;
  } else if (stage === "chat") {
    return (
      <ChatView
        videoId={videoId}
        sessionId={sessionId}
        title={title}
        duration={duration}
        channel={channel}
        cefrLevel={cefrLevel}
        complexity={complexity}
        diffDescr={diffDescr}
        expressions={expressions}
        cultureNote={cultureNote}
        language={language}
        chunks={chunks}
        vocab={vocab}
      ></ChatView>
    );
  }
  return null;
}
export default App;
