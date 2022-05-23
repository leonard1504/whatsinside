qrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const btnScanQR = document.getElementById("scan");
const btnGenQR = document.getElementById("gen");

let scanning = false;

qrcode.callback = (res) => {
  if (res) {
    let data = { element: res };
    (async () => {
      const rawResponse = await fetch("/qrscan", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const content = await rawResponse.json();

      console.log(content);
    })();
    scanning = false;

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    canvasElement.hidden = true;
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

btnGenQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = false;
      canvasElement.hidden = true;
      video.remove();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 100);
  }
}
