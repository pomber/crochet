import React, { useState } from "react";
import ReactDOM from "react-dom";

console.log("devtools init");

function treeToString(tree, leftPad = "") {
  if (tree.children.length === 0) {
    return `${leftPad}<${tree.name} />`;
  }

  return [
    `${leftPad}<${tree.name}>`,
    ...tree.children.map(child => treeToString(child, leftPad + "  ")),
    `${leftPad}</${tree.name}>`
  ].join("\n");
}

function SubtreeUpdate({ update }) {
  const { tree, logs, start } = update;
  return (
    <div style={{ flex: 1, display: "flex" }}>
      <pre style={{ flex: 1 }}>{treeToString(tree)}</pre>
      <div style={{ flex: 2 }}>
        {logs.map((log, index) => (
          <div key={index}>{`${Math.round(log.ts)} - ${log.description}`}</div>
        ))}
      </div>
    </div>
  );
}

function App({ history }) {
  const [index, setIndex] = useState(history.length ? history.length - 1 : 0);
  if (history.length === 0) {
    return (
      <div>
        <h2>{chrome.devtools.inspectedWindow.tabId}</h2>
        <p>Waiting...</p>
      </div>
    );
  }
  const current = history[index];
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ul style={{ listStyleType: "none", display: "flex", padding: 0 }}>
        {history.map((message, index) => (
          <li key={index}>
            <button onClick={() => setIndex(index)}>
              {message.name || index}
            </button>
          </li>
        ))}
      </ul>
      <SubtreeUpdate update={current} />
    </div>
  );
}

const history = [];
const $root = document.getElementById("root");
ReactDOM.render(<App history={history} />, root);

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "" + chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(message => {
  console.log("devtools", message);
  history.push(message.data);
  ReactDOM.render(<App history={history} />, root);
});
