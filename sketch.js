let facemesh;
let video;
const indices = [409,270,269,267,0,37,39,40,185,61,146,91,181,84,17,314,405,321,375,291];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 使用 ml5.faceMesh 並在 modelReady 時啟動預測
  facemesh = ml5.faceMesh(video, modelReady);
}

function modelReady() {
  console.log('Facemesh model loaded!');
  // 不需再註冊 on/predict
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  drawFaceMeshLines();
}

function drawFaceMeshLines() {
  // 直接從 facemesh.predictions 取得結果
  if (facemesh && facemesh.predictions && facemesh.predictions.length > 0) {
    let keypoints = facemesh.predictions[0].scaledMesh;
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    beginShape();
    for (let i = 0; i < indices.length; i++) {
      let idx = indices[i];
      let [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape();
  }
}
