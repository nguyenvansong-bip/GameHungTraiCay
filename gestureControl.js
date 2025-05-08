let handX = 0; // giá trị từ 0 đến 1 (tọa độ x của ngón trỏ)

const videoElement = document.createElement('video');
videoElement.style.display = 'none';
document.body.appendChild(videoElement);

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5,
});

hands.onResults((results) => {
  if (results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    handX = landmarks[8].x; // ngón trỏ
  }
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});
camera.start();
