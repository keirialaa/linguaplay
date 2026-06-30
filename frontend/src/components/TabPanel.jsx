import { useState } from "react";
import Chat from "./Chat";
import Transcript from "./Transcript";
import Vocabulary from "./Vocabulary";

function TabPanel({ videoId, chunks }) {
  const [tabState, setTabState] = useState("chat");

  let activeTab;
  if (tabState === "chat") {
    activeTab = <Chat videoId={videoId}></Chat>;
  } else if (tabState === "transcript") {
    activeTab = <Transcript chunks={chunks}></Transcript>;
  } else {
    activeTab = <Vocabulary></Vocabulary>;
  }

  return (
    <div className="tab-panel-container">
      <div className="panel-header">
        <div
          className={tabState === "chat" ? "tab chat current" : "tab chat"}
          onClick={() => setTabState("chat")}
        >
          <p>Chat</p>
        </div>
        <div
          className={
            tabState === "transcript"
              ? "tab transcript current"
              : "tab vocabulary"
          }
          onClick={() => setTabState("transcript")}
        >
          <p>Transcript</p>
        </div>
        <div
          className={
            tabState === "vocabulary"
              ? "tab vocabulary current"
              : "tab vocabulary"
          }
          onClick={() => setTabState("vocabulary")}
        >
          <p>Vocabulary</p>
        </div>
      </div>
      {activeTab}
    </div>
  );
}
export default TabPanel;
