console.log("bg 2");

const devToolsPorts = {};

chrome.runtime.onConnect.addListener(port => {
  const isDevTools = isNumeric(port.name);
  const tab = isDevTools ? port.name : port.sender.tab.id;
  console.log("background connect");
  console.log("isDevTools", isDevTools);
  console.log("tab", tab);
  devToolsPorts[tab] = port;

  if (!isDevTools) {
    // content script
    port.onMessage.addListener(message => {
      console.log("background receives message", message);
      const hasDevTools = tab in devToolsPorts;
      if (hasDevTools) {
        console.log("background sends message");
        const devToolsPort = devToolsPorts[tab];
        devToolsPort.postMessage(message);
      }
    });
  }
});

function isNumeric(str) {
  return +str + "" === str;
}
