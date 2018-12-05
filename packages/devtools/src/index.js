import React from "react";
import ReactDOM from "react-dom";

console.log("devtools init");

ReactDOM.render(
  <div>
    <h2>{chrome.devtools.inspectedWindow.tabId}</h2>
    <pre>Faa</pre>
  </div>,
  document.getElementById("root")
);

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "" + chrome.devtools.inspectedWindow.tabId
});

console.log("port", backgroundPageConnection);
backgroundPageConnection.onMessage.addListener(message => {
  console.log("devtools", message);
  ReactDOM.render(
    <div>
      <h2>{chrome.devtools.inspectedWindow.tabId}</h2>
      <pre>{JSON.stringify(message)}</pre>
    </div>,
    document.getElementById("root")
  );
});
