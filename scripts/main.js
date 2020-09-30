function startRecordingButton(){
    /*Verify if Microphone is already enabled*/
    navigator.permissions.query({name: "microphone"}).then(function(result){
        if(result.state == "granted"){
            /*Go to recording page and record audio*/
            recordAudio();
        }
        else if(result.state == "denied"){
            /*Go to mic no enabled page (and maybe offer a button there that enables mic)*/
        }
        else if(result.state == "prompt"){
            /*Ask for mic to be used and reiterate function*/
            navigator.mediaDevices.getUserMedia({audio:true, video:false}).then(recordAudio());
            console.log(result);
        }
        else{
            /*Some error treatment, or possibly just a prompt clone*/
        }
    });
}

function recordAudio(){
    console.log("Yay");
}