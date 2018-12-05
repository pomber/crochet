console.log("bg 3");

const devToolsPorts = {};

chrome.runtime.onConnect.addListener(port => {
  const isDevTools = isNumeric(port.name);
  const tab = isDevTools ? +port.name : port.sender.tab.id;
  console.log(`${tab} - ${isDevTools ? "devtools" : "content"} connected`);
  devToolsPorts[tab] = port;

  if (!isDevTools) {
    // add listener for content script messages
    port.onMessage.addListener(message => {
      console.log(`${tab} - content sends:`, message);
      console.log("devtools", devToolsPorts);
      const hasDevTools = tab in devToolsPorts;
      if (hasDevTools) {
        console.log(`${tab} - sending message`);
        const devToolsPort = devToolsPorts[tab];
        devToolsPort.postMessage(message);
      }
    });
  }
});

function isNumeric(str) {
  return +str + "" === str;
}
