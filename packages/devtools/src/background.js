console.log("bg 1");

chrome.runtime.onConnect.addListener(function(port) {
  console.log("background connect", port.name);
  port.onMessage.addListener(message => {
    console.log("background message", message);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("background on message", request, sender, sendResponse);
  return true;
});
