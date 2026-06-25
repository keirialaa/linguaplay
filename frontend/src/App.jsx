import { useState } from "react";
import "./App.css";
import ChatView from "./components/ChatView";
import EntryView from "./components/EntryView";
import ProcessingView from "./components/ProcessingView";

function App() {
  const [stage, setStage] = useState("entry");
  const [videoId, setVideoId] = useState(null);
  const [title, setTitle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [channel, setChannel] = useState(null);
  const [cefrLevel, setCefrLevel] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [diffDescr, setDiffDescr] = useState(null);
  const [expressions, setExpressions] = useState(null);
  const [cultureNote, setCultureNote] = useState(null);

  if (stage === "entry") {
    return (
      <EntryView
        changeStage={setStage}
        setVideoId={setVideoId}
        setTitle={setTitle}
        setDuration={setDuration}
        setChannel={setChannel}
        setCefrLevel={setCefrLevel}
        setComplexity={setComplexity}
        setDiffDescr={setDiffDescr}
        setExpressions={setExpressions}
        setCultureNote={setCultureNote}
      ></EntryView>
    );
  } else if (stage === "processing") {
    return <ProcessingView changeStage={setStage}></ProcessingView>;
  } else if (stage === "chat") {
    return (
      <ChatView
        videoId={videoId}
        title={title}
        duration={duration}
        channel={channel}
        cefrLevel={cefrLevel}
        complexity={complexity}
        diffDescr={diffDescr}
        expressions={expressions}
        cultureNote={cultureNote}
      ></ChatView>
    );
  }
}
export default App;
