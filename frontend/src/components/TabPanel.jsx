import { useState } from "react";
import Chat from "./Chat";

function TabPanel() {
  const [tabState, setTabState] = useState("chat");

  let activeTab;
  if (tabState === "chat") {
    activeTab = <Chat></Chat>;
  } else if (tabState === "transcript") {
    activeTab = <Transcript></Transcript>;
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
            tabState === "transcript" ? "tab transcript current" : "tab chat"
          }
          onClick={() => setTabState("transcript")}
        >
          <p>Transcript</p>
        </div>
        <div
          className="tab vocabulary"
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
