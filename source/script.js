var states = [], contextMenuID = chrome.contextMenus.create({
  title: chrome.i18n.getMessage("start"), 
  contexts:["video"], 
  onclick: start
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	updateMenu(states[activeInfo.tabId] ? "stop" : "start");
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { 
	if(request=="stop")stop();
	else chrome.downloads.download({ url: request, filename: "record.mp4" });
});

function updateMenu(action) {
	chrome.contextMenus.update(contextMenuID, {
		title: chrome.i18n.getMessage(action), 
		contexts:["video"], 
		onclick: action == "start" ? start : stop
	});
}

function start(info, tab){
  updateMenu("stop");
  states[tab.id] = true;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {chrome.tabs.sendMessage(tabs[0].id, "start");});
}

function stop(info, tab){
  updateMenu("start");
  states[tab.id] = false;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {chrome.tabs.sendMessage(tabs[0].id, "stop");});
}