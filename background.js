let w;
let modState;
const windowsGetCurrent = getInfo => {
  return new Promise((resolve, reject) => {
    chrome.windows.getCurrent(getInfo, wnd => {
      resolve(wnd);
    });
  });
};
const tabGetCurrent = getInfo => {
  return new Promise((resolve, reject) => {
    chrome.tabs.getCurrent(wnd => {
      resolve(wnd);
    });
  });
};
const windowsGetAll = getInfo => {
  return new Promise((resolve, reject) => {
    chrome.windows.getAll(getInfo, wnds => {
      resolve(wnds);
    });
  });
};

chrome.runtime.onMessage.addListener(async (msg, sndr) => {
  console.log(msg);

  if (typeof msg === 'object' && msg.hasOwnProperty('openInWindow')) {
    currentWindow = await windowsGetCurrent();
    const gotoURL = msg.openInWindow; // new URL(msg.openInWindow).search.substr(1);
    if (
      w &&
      w.id &&
      w.id != currentWindow.id &&
      (await windowsGetAll()).filter(wnd => wnd.id === w.id).length > 0
    )
      chrome.tabs.create({ windowId: w.id, url: gotoURL });
    else
      chrome.windows.create(
        {
          url: gotoURL,
          focused: false
        },
        cw => (w = cw)
      );
  } else if (typeof msg === 'object' && msg.hasOwnProperty('modState')) {
    modState = msg.modState;
    console.log(modState);
  }
});

/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );
  if (request.greeting == 'hello') sendResponse({ farewell: 'goodbye' });
}); */
var HEADERS_TO_STRIP_LOWERCASE = ['content-security-policy', 'x-frame-options'];

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    return {
      responseHeaders: details.responseHeaders.filter(function(header) {
        return (
          HEADERS_TO_STRIP_LOWERCASE.indexOf(header.name.toLowerCase()) < 0
        );
      })
    };
  },
  {
    urls: ['<all_urls>']
  },
  ['blocking', 'responseHeaders']
);
