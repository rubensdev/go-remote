let connStatus = document.getElementById("status");

let touchpadMode = document.getElementById("touchpad-mode");
let touchPadLeftBtn = document.getElementById("touchpad-btn-0");
let touchPadRightBtn = document.getElementById("touchpad-btn-1");

let mediaButtons = document.querySelectorAll(".media_btn");

let modeButtons = document.querySelectorAll(".mode_btn__btn");

let keyboardMode = document.getElementById("keyboard-mode");
let keys = document.querySelectorAll(".keyboard__key");

let socket;
let elt;
let lastXPos;
let lastYPos;

document.addEventListener("visibilitychange", (evt) => {
  console.log("visibilitychange", document.visibilityState);
  if (socket) {
    socket.send(document.visibilityState, elt);
  }
});

document.body.addEventListener("htmx:wsOpen", (evt) => {
  console.log("Connected");
  const touchpad = document.querySelector(".touchpad");

  socket = evt.detail.socketWrapper;
  elt = evt.detail.elt;

  touchpad.addEventListener("click", handleTouchClick, false);
  touchpad.addEventListener("touchstart", handleTouchStart, false);
  touchpad.addEventListener("touchmove", handleTouchMove, false);

  touchPadLeftBtn.addEventListener("click", function () {
    socket.send("click 0|false");
  });
  touchPadRightBtn.addEventListener("click", function () {
    socket.send("click 1|false");
  });

  connStatus.innerText = window.LANG.connected;

  mediaButtons.forEach(function (btn) {
    btn.addEventListener("click", function (evt) {
      socket.send(evt.target.dataset.action);
    });
  });

  modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function (evt) {
      const mode = evt.target.dataset.mode;

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

  keys.forEach(function (btn) {
    btn.addEventListener("click", function (evt) {
      socket.send(evt.target.dataset.action);
    });
  });
});

document.body.addEventListener("htmx:wsClose", (evt) => {
  console.log("Disconnected");
  connStatus.innerText = window.LANG.disconnected;
});

const handleTouchClick = (evt) => {
  socket.send(`click ${evt.button}|false`);
};

const handleTouchStart = (evt) => {
  const touchPos = evt.touches[0];

  lastXPos = touchPos.clientX;
  lastYPos = touchPos.clientY;
};

const handleTouchMove = (evt) => {
  const touchPos = evt.touches[0];

  processCoords(touchPos.clientX, touchPos.clientY, false);
};

const processCoords = (curPosX, curPosY, isScroll) => {
  const x = curPosX - lastXPos;
  const y = curPosY - lastYPos;

  lastXPos = curPosX;
  lastYPos = curPosY;
  socket.send(`move ${x >> 0}|${y >> 0}|${isScroll}`);
};
