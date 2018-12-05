import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<div>Faa</div>, document.getElementById("root"));

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "" + chrome.devtools.inspectedWindow.tabId
});

console.log("port", backgroundPageConnection);
backgroundPageConnection.onMessage.addListener(message =>
  console.log("devtools", message)
);
