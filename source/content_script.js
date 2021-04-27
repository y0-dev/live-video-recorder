var video, recorder, clickedElement, type = 'video/webm;codecs=h264';

document.addEventListener("mousedown", function(event){
  if(event.button == 2) clickedElement=event.target;
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { if(request=="start")startRecording();else stopRecording(); });

function startRecording() {
  video = clickedElement;var options = {};
  if(MediaRecorder.isTypeSupported(type))options = {mimeType : type};
  try {
	recorder = new MediaRecorder(video.captureStream(), options);
	recorder.ondataavailable = e => {
		let b = e.data;
		if(b.type == type)b = new Blob([e.data], {type: 'video/mp4'});
		chrome.runtime.sendMessage(URL.createObjectURL(b));
	};
	recorder.start();
	video.addEventListener('ended', Over, false);
	
	var style = document.createElement("STYLE");
	var css = '.zlvring::after {content: "•"; color: red; font-weight: bold; font-size: xx-large; position: relative; margin: 2px;}';
	style.appendChild(document.createTextNode(css));
	document.body.appendChild(style);
	video.parentElement.classList.add("zlvring");

  } catch (error) {
	  alert(error.name);
  }
}

function Over() {
	chrome.runtime.sendMessage('stop');
}

function stopRecording() {
  if(recorder && recorder.state != 'inactive') recorder.stop();
  if(video){
	video.parentElement.classList.remove("zlvring");
	video.removeEventListener('ended', Over, false);
  }
}