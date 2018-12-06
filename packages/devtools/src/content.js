console.log("content 6");

function installGlobalHook(window) {
  if (window.__CROCHET_DEVTOOLS_GLOBAL_HOOK__) {
    return;
  }
  var hook = {
    post: data => {
      window.postMessage(
        {
          source: "crochet-devtools",
          foo: new Date().toString(),
          data
        },
        "*"
      );
    }
  };

  Object.defineProperty(window, "__CROCHET_DEVTOOLS_GLOBAL_HOOK__", {
    value: hook
  });
}

var js = ";(" + installGlobalHook.toString() + "(window))";

var script = document.createElement("script");
script.textContent = js;
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);

let port = null;
window.addEventListener("message", handleMessageFromPage);
function handleMessageFromPage(evt) {
  if (!port) {
    port = chrome.runtime.connect({
      name: "content-script"
    });
  }
  console.log("content receive", evt);
  if (evt.source === window && evt.data) {
    // console.log('page -> rep -> dev', evt.data);
    console.log("content send", evt.data);
    port.postMessage(evt.data);
  }
}
