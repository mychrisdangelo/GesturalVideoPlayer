//
// Startup
//
var _isDown, _points, _r, _g, _rc;

function onLoadEvent()
{
  _points = new Array();
  _r = new DollarRecognizer();
  var canvas = document.getElementById('overlay');
  _g = overlay.getContext('2d');
  _g.fillStyle = "rgb(0,0,225)";
  _g.strokeStyle = "rgb(0,0,225)";
  _g.lineWidth = 3;
  _g.fillStyle = "rgb(255,255,136)";
  _rc = getCanvasRect(overlay);
  _isDown = false;
}

function getCanvasRect(canvas)
{
  var w = canvas.width;
  var h = canvas.height;

  var cx = canvas.offsetLeft;
  var cy = canvas.offsetTop;
  while (canvas.offsetParent != null)
  {
    canvas = canvas.offsetParent;
    cx += canvas.offsetLeft;
    cy += canvas.offsetTop;
  }
  return {x: cx, y: cy, width: w, height: h};
}

function getScrollY()
{
  var scrollY = 0;
  // if (typeof(document.body.parentElement) != 'undefined')
  // {
  //   scrollY = document.body.parentElement.scrollTop; // IE
  // }
  // else if (typeof(window.pageYOffset) != 'undefined')
  // {
  //
  // }
  scrollY = window.pageYOffset; // FF
  return scrollY;
}

//
// Mouse Events
//
function mouseDownEvent(x, y)
{
  document.onselectstart = function() { return false; } // disable drag-select
  document.onmousedown = function() { return false; } // disable drag-select
  _isDown = true;
  x -= _rc.x;
  y -= _rc.y - getScrollY();

  _points.length = 1; // clear
  _points[0] = new Point(x, y);
  var result = document.getElementById('showGestureTrail').checked;
  if (result === true) {
    _g.fillRect(x - 4, y - 3, 9, 9);
  } 
}

function mouseMoveEvent(x, y)
{
  if (_isDown)
  {
    // console.log('(' + x + ', ' + y + ')');
    x -= _rc.x;
    y -= _rc.y - getScrollY();
    _points[_points.length] = new Point(x, y); // append
    var result = document.getElementById('showGestureTrail').checked;
    if (result === true) {
      drawConnectedPoint(_points.length - 2, _points.length - 1);
    } 
  }
}

function mouseUpEvent(x, y)
{
  document.onselectstart = function() { return true; } // enable drag-select
  document.onmousedown = function() { return true; } // enable drag-select
  if (_isDown)
  {
    _isDown = false;
    if (_points.length >= 10)
    {
      var myVideo = document.getElementById("myVideo");
      var playbackSpeedStr = "Normal";
      var playbackSpeed = 1;
      var displayString = "";

      $(".alert-warning").hide();
      $(".alert-success").show();
      var result = _r.Recognize(_points, false);
      if (result.Name == "circle") {
        vid_play_pause();
        displayString = "Play";
        if (myVideo.paused) { displayString = "Paused"; }
        $(".alert-success").html(displayString + ".");
      } else if (result.Name == "right square bracket") {
        vid_seek_forward();
        $(".alert-success").html("Seek Forward.");
      } else if (result.Name == "left square bracket") {
        $(".alert-success").html("Seek Backwards.");
        vid_seek_backward();
      } else if (result.Name == "x") {
        vid_mute();
        displayString = "Unmuted";
        if (myVideo.muted) { displayString = "Muted"; }
        $(".alert-success").html(displayString + ".");
      } else if (result.Name == "rectangle") {
        vid_enlarge();
        $(".alert-success").html("Enlarged video player. (Width: " + myVideo.width + "px, Height: " + myVideo.height + "px)");
      } else if (result.Name == "triangle") {
        vid_shrink();
        $(".alert-success").html("Shrank video player. (Width: " + myVideo.width + "px, Height: " + myVideo.height + "px)");
      } else if (result.Name == "heart") {
        displayString = "Slowed down video playback speed. Now at ";
        if (myVideo.playbackRate == 0.5) { displayString = "Can't slow down more. At slowest speed possible:  "; }
        vid_slowdown();
        playbackSpeed = myVideo.playbackRate;
        switch (playbackSpeed) {
          case 1:
            playbackSpeedStr = "Normal";
            break;
          case 0.5:
            playbackSpeedStr = "Half Speed";
            break;
          case 2:
            playbackSpeedStr = "Double Speed";
            break;
        }
        $(".alert-success").html(displayString + playbackSpeedStr + ".");
      } else if (result.Name == "figure eight") {
        displayString = "Sped up video playback speed. Now at ";
        if (myVideo.playbackRate == 2) { displayString = "Can't speed up more. At fastest speed possible: "; }
        vid_speedup();
        playbackSpeed = myVideo.playbackRate;
        switch (playbackSpeed) {
          case 1:
            playbackSpeedStr = "Normal";
            break;
          case 0.5:
            playbackSpeedStr = "Half Speed";
            break;
          case 2:
            playbackSpeedStr = "Double Speed";
            break;
        }
        $(".alert-success").html(displayString + playbackSpeedStr + ".");
      } else if (result.Name == "caret") {
        vid_volumeup();
        $(".alert-success").html("Volume up. Now at " + Math.round(myVideo.volume/1*100) + "%.");
      } else if (result.Name == "v") {
        vid_volumedown();
        $(".alert-success").html("Volume down. Now at " + Math.round(myVideo.volume/1*100) + "%.");
      } else {
        $(".alert-warning").hide();
        $(".alert-success").show();
        $(".alert-warning").html("Unrecognized gesture. Please try again.");
      }
    } else {
      $(".alert-warning").show();
      $(".alert-success").hide();
      $(".alert-warning").html("Unrecognized gesture. Please try again.");
    }
    $('.alert').delay(3000).fadeOut('slow'); 
    if (_points.length > 0)
       _g.clearRect(0, 0, _rc.width, _rc.height);
  }
}

function drawConnectedPoint(from, to)
{
  _g.beginPath();
  _g.moveTo(_points[from].X, _points[from].Y);
  _g.lineTo(_points[to].X, _points[to].Y);
  _g.closePath();
  _g.stroke();
}

function round(n, d) // round 'n' to 'd' decimals
{
  d = Math.pow(10, d);
  return Math.round(n * d) / d;
}

//
// Unistroke Adding and Clearing
//
function onClickAddExisting()
{
  if (_points.length >= 10)
  {
    var unistrokes = document.getElementById('unistrokes');
    var name = unistrokes[unistrokes.selectedIndex].value;
    var num = _r.AddGesture(name, _points);
    drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
  }
}

function onClickAddCustom()
{
  var name = document.getElementById('custom').value;
  if (_points.length >= 10 && name.length > 0)
  {
    var num = _r.AddGesture(name, _points);
    drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
  }
}

function onClickCustom()
{
  document.getElementById('custom').select();
}

function onClickDelete()
{
  var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
  alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
}

$(function(){
  $('#showhelp').click(function(){
    if($('#helpscreen').is(':visible')){
      $('#helpscreen').fadeOut();
      $("#showhelp").html("Show Help");
    } else {
      $('#helpscreen').fadeIn();
      $("#showhelp").html("Hide Help");
    }
  });

  $('#gesturalvidlink').click(function(){
    $('#helpscreen').fadeOut();
  });

  $('#alerthelper').click(function(){
    $('#helpscreen').fadeIn();
  });

  $('#showgesturelink').click(function(){
    if($('#showGestureTrail').prop('checked')) {
      $('#showGestureTrail').prop('checked', false);
      $("#showgesturelink").html("Show Gesture Trail");
    } else {
      $('#showGestureTrail').prop('checked', true);
      $("#showgesturelink").html("Hide Gesture Trail");
    }
  });

  var position = $('#showhelp').offset();
  $('.arrow').css('left', position.left+25); // show the arrow under "show help"
  $('.arrow').delay(3500).fadeOut('slow'); // show the arrow on load for 3.6 seconds
});