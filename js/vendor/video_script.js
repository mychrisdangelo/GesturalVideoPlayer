function vid_play_pause() {
  var myVideo = document.getElementById("myVideo");
  if (myVideo.paused) {
    myVideo.play();
  } else {
    myVideo.pause();
  }
}

function vid_seek_forward() {
  var myVideo = document.getElementById("myVideo");
  myVideo.currentTime+=15;
}

function vid_seek_backward() {
  var myVideo = document.getElementById("myVideo");
  myVideo.currentTime-=15;
}