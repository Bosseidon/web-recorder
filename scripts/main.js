'use strict';

let mediaRecorder;
let recordedBlobs;

//Buttons
//const startButton = document.getElementById("start-button");
const recordButton = document.getElementById("record-button");
const stopButton = document.getElementById("stop-button");
const playButton = document.getElementById("play-button");
const downloadButton = document.getElementById("download-button");

//Audio
const recordedAudio = document.getElementById("audio-playback-player");

//Recording dot
const recordingDot = document.getElementById("recording-dot");

//Blobs
const auxBLobs = null;

//Retired function
/*recordButton.addEventListener("click", () => {
    startRecording();
});*/

stopButton.addEventListener("click", () => {
    stopRecording();
});

playButton.addEventListener("click", () => {
    const superBuffer = new Blob(recordedBlobs, {type: "audio/webm"});
    recordedAudio.src = window.URL.createObjectURL(superBuffer);
    recordedAudio.play();
});

downloadButton.addEventListener("click", () => {
    const blob = new Blob(recordedBlobs, {type: "audio/webm"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "test.wav";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
});

function handleDataAvailable(Event){
    if(Event.data && Event.data.size > 0){
        recordedBlobs.push(Event.data);
    }
}

function startRecording(){
    recordedBlobs = [];
    let options = {mimeType: "audio/webm"};
    
    //some error stuff

    try{
        mediaRecorder = new MediaRecorder(window.stream, options);
    }
    catch(e){
        //error handling
        console.error("Exception while creating MediaRecorder: ", e);
        //errorMsgElement.innerHTML = "Exception while creating MediaRecorder: ${JSON.stringify(e)}";
        return;
    }

    console.log("Created MediaRecorder ", mediaRecorder, " with options ", options);

    mediaRecorder.onstop = (Event) =>{
        console.log("Recorder stopped: ", Event);
        console.log("Recorded Blobs: ", recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log("MediaRecorder started", mediaRecorder);

    recordButton.disabled = true;
    stopButton.disabled = false;
    playButton.disabled = true;
    downloadButton.disabled = true;

    recordingDot.setAttribute("style","display: inline-block");
}

function stopRecording(){
    mediaRecorder.stop();

    recordButton.disabled = false;
    stopButton.disabled = true;
    playButton.disabled = false;
    downloadButton.disabled = false;

    recordingDot.setAttribute("style","display: none");
}

function handleSuccess(stream){
    window.stream = stream;
}

async function init(constraints){
    try{
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    }
    catch(e){
        console.error("navigator.getUserMedia error: ", e);
        document.getElementById("record-audio-page").setAttribute("style","display: none;");
        document.getElementById("microphone-error-page").setAttribute("style", "display: block");
    }
}

recordButton.addEventListener("click", async() => {
    const constraints = {audio:true, video:false};
    console.log("Using media contraints: ", constraints);
    await init(constraints);

    startRecording();
});