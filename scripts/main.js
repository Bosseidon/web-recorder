function startRecordingButton(){
    let shouldStop = false;
    let stopped = false;

    const downloadLink = document.getElementById("download-audio-file-link");
    const stopButton = document.getElementById("stop-recording-button");

    stopButton.addEventListener('click', function(){
        shouldStop = true;
    });

    var handleSuccess = function(stream){
        const recordedChunks = [];
        const options = {mimeType: "video/webm;codecs=vp9"};
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener("dataavailable", function(e){
            if(e.data.size > 0){
                recordedChunks.push(e.data);
            }
            if(shouldStop === true && stopped === false){
                mediaRecorder.stop();
                stopped = true;
                console.log("Stop");
            }
        });

        mediaRecorder.addEventListener("stop", function(){
            downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
            downloadLink.download = "acetest.wav";
        });

        mediaRecorder.start();
    };

    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(handleSuccess);
};