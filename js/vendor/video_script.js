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

function vid_mute() {
  var myVideo = document.getElementById("myVideo");
  if (myVideo.muted) {
    myVideo.muted = false;
  } else {
    myVideo.muted = true;
  }
}

function vid_enlarge() {
  var myVideo = document.getElementById("myVideo");
  myVideo.width += 50;
  myVideo.height += 50;
}

function vid_shrink() {
  var myVideo = document.getElementById("myVideo");
  myVideo.width -= 50;
  myVideo.height -= 50;
}

function vid_slowdown() {
  var myVideo = document.getElementById("myVideo");
  var newPlayback = myVideo.playbackRate / 2;
  if (newPlayback <= 0.5) {
    newPlayback = 0.5;
  }
  myVideo.playbackRate = newPlayback;
}

function vid_speedup() {
  var myVideo = document.getElementById("myVideo");
  var newPlayback = myVideo.playbackRate * 2;
  if (newPlayback >= 2) {
    newPlayback = 2;
  }
  myVideo.playbackRate = newPlayback;
}

function vid_volumeup() {
  var myVideo = document.getElementById("myVideo");
  if ((myVideo.volume + 0.10) > 1) {
    myVideo.volume = 1;
  } else {
      myVideo.volume += 0.10;
  }
}

function vid_volumedown() {
  var myVideo = document.getElementById("myVideo");
  if ((myVideo.volume - 0.10) < 0) {
    myVideo.volume = 0;
  } else {
    myVideo.volume -= 0.10;
  }
}

