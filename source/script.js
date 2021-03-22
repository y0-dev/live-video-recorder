var contextMenuID = chrome.contextMenus.create({
  title: chrome.i18n.getMessage("start"), 
  contexts:["video"], 
  onclick: start
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
	if(request=="stop")stop();
	else chrome.downloads.download({ url: request, filename: "record.mp4" });
});

function start(info, tab){
	chrome.contextMenus.update(contextMenuID, {
        title: chrome.i18n.getMessage("stop"),
        contexts: ["video"],
        onclick: stop
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {chrome.tabs.sendMessage(tabs[0].id, "start");});
}

function stop(info, tab){
	chrome.contextMenus.update(contextMenuID, {
        title: chrome.i18n.getMessage("start"),
        contexts: ["video"],
        onclick: start
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {chrome.tabs.sendMessage(tabs[0].id, "stop");});
}