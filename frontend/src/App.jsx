import { useState } from "react";
import "./App.css";
import ChatView from "./components/ChatView";
import EntryView from "./components/EntryView";
import ProcessingView from "./components/ProcessingView";

function App() {
  const [stage, setStage] = useState("entry");

  if (stage === "entry") {
    return <EntryView changeStage={setStage}></EntryView>;
  } else if (stage === "processing") {
    return <ProcessingView changeStage={setStage}></ProcessingView>;
  } else if (stage === "chat") {
    return <ChatView></ChatView>;
  }
}
export default App;
