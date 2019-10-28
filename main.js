const video = document.querySelector("#videoElement");
const song = document.querySelector("#intro");
const body = document.querySelector("body");
const ready = document.querySelector("#ready");
let loaded = false;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}

const loadup = async () => {
  console.log('loading models');
  await faceapi.nets.ssdMobilenetv1.loadFromUri('models');
  await faceapi.nets.faceExpressionNet.loadFromUri('models');
  console.log('finished loading models');
  loaded = true;
  ready.textContent = "SMILE AND TURN UP YOUR VOLUME 😊";
}


const checkFace = async () => {
  const face = await faceapi.detectSingleFace(video).withFaceExpressions();
  if (!face) return;
  let expression = "";
  let weight;
  for (let emotion in face.expressions) {
    if (!weight) {
      weight = face.expressions[emotion];
      expression = emotion;
    }
    if (face.expressions[emotion] > weight) {
      expression = emotion;
      weight = weight;
    }
  }

  if (["surprised", "happy", "angry"].includes(expression)){
    if (song.paused) {
      song.play();
      body.id = "party";
    }
  } else {
    song.currentTime = 0;
    song.pause();
    body.id = "";
  }

}


setInterval(async () => {
  if (loaded) {
    checkFace();
  }
}, 1000);

loadup();

