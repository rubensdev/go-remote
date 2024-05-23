(() => {
  // assets/js/app.js
  var status = document.getElementById("status");
  var touchpadMode = document.getElementById("touchpad-mode");
  var touchPadLeftBtn = document.getElementById("touchpad-btn-0");
  var touchPadRightBtn = document.getElementById("touchpad-btn-1");
  var mediaButtons = document.querySelectorAll(".media_btn");
  var modeButtons = document.querySelectorAll(".mode_btn");
  var keyboardMode = document.getElementById("keyboard-mode");
  var keys = document.querySelectorAll(".keyboard__key");
  var socket;
  var elt;
  var lastXPos;
  var lastYPos;
  document.addEventListener("visibilitychange", (evt) => {
    console.log("visibilitychange", document.visibilityState);
    if (socket) {
      socket.send(document.visibilityState, elt);
    }
  });
  document.body.addEventListener("htmx:wsOpen", (evt) => {
    console.log("Connected");
    const touchpad = document.querySelector(".touchpad");
    console.log(window.LANG);
    socket = evt.detail.socketWrapper;
    elt = evt.detail.elt;
    console.log(evt.detail);
    touchpad.addEventListener("click", handleTouchClick, false);
    touchpad.addEventListener("touchstart", handleTouchStart, false);
    touchpad.addEventListener("touchmove", handleTouchMove, false);
    touchPadLeftBtn.addEventListener("click", function() {
      socket.send("click 0|false");
    });
    touchPadRightBtn.addEventListener("click", function() {
      socket.send("click 1|false");
    });
    status.innerText = "Connected";
    console.log(status);
    mediaButtons.forEach(function(btn) {
      btn.addEventListener("click", function(evt2) {
        socket.send(evt2.target.dataset.action);
      });
    });
    modeButtons.forEach(function(btn) {
      btn.addEventListener("click", function(evt2) {
        const mode = evt2.target.dataset.mode;
        switch (mode) {
          case "touchpad": {
            keyboardMode.classList.remove("show");
            touchpadMode.classList.add("show");
            break;
          }
          case "keyboard": {
            touchpadMode.classList.remove("show");
            keyboardMode.classList.add("show");
            break;
          }
        }
      });
    });
    keys.forEach(function(btn) {
      btn.addEventListener("click", function(evt2) {
        socket.send(evt2.target.dataset.action);
      });
    });
  });
  document.body.addEventListener("htmx:wsClose", (evt) => {
    console.log("Disconnected");
    status.innerText = "Disconnected";
  });
  var handleTouchClick = (evt) => {
    socket.send(`click ${evt.button}|false`);
  };
  var handleTouchStart = (evt) => {
    const touchPos = evt.touches[0];
    lastXPos = touchPos.clientX;
    lastYPos = touchPos.clientY;
  };
  var handleTouchMove = (evt) => {
    const touchPos = evt.touches[0];
    processCoords(touchPos.clientX, touchPos.clientY, false);
  };
  var processCoords = (curPosX, curPosY, isScroll) => {
    const x = curPosX - lastXPos;
    const y = curPosY - lastYPos;
    lastXPos = curPosX;
    lastYPos = curPosY;
    socket.send(`move ${x >> 0}|${y >> 0}|${isScroll}`);
  };
})();
