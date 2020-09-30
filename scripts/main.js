'use strict';

let mediaRecorder;
let recordedBlobs;

//Buttons
const startButton = document.getElementById("start-button");
const recordButton = document.getElementById("record-button");
const stopButton = document.getElementById("stop-button");
const playButton = document.getElementById("play-button");
const downloadButton = document.getElementById("download-button");

//Audio
const recordedAudio = document.getElementById("audio-playback-player");

recordButton.addEventListener("click", () => {
    startRecording();
});

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
    a.download = "test.webm";
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
}

function stopRecording(){
    mediaRecorder.stop();
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
    }
}

startButton.addEventListener("click", async() => {
    const constraints = {audio:true, video:false};
    console.log("Using media contraints: ", constraints);
    await init(constraints);
});