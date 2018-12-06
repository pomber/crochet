import React, { useState } from "react";
import ReactDOM from "react-dom";

console.log("devtools init");

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
            <button onClick={() => setIndex(index)}>{index}</button>
          </li>
        ))}
      </ul>
      <pre style={{ flex: 1 }}>{JSON.stringify(current, null, 2)}</pre>
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
  history.push(message);
  ReactDOM.render(<App history={history} />, root);
});
