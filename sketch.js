let facemesh;
let predictions = [];
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
  facemesh.on('predict', gotResults); // 監聽預測事件
}

function gotResults(results) {
  predictions = results;
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  drawFaceMeshLines();
}

function drawFaceMeshLines() {
  if (predictions.length > 0) {
    let keypoints = predictions[0].scaledMesh;
    // 第一組紅色線條
    const lineIndices = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];
    stroke(255, 0, 0);
    strokeWeight(15);
    noFill();
    for (let i = 0; i < lineIndices.length - 1; i++) {
      let idxA = lineIndices[i];
      let idxB = lineIndices[i + 1];
      let [x1, y1] = keypoints[idxA];
      let [x2, y2] = keypoints[idxB];
      line(x1, y1, x2, y2);
    }

    // 第二組藍色填滿
    const fillIndices = [76,77,90,180,85,16,315,404,320,307,306,408,304,303,302,11,72,73,74,184];
    noStroke();
    fill(0, 0, 255, 150); // 半透明藍色
    beginShape();
    for (let i = 0; i < fillIndices.length; i++) {
      let idx = fillIndices[i];
      let [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);

    // 在紅線與藍區之間充滿紫色
    // 這裡假設兩組陣列相同，若不同可自行調整
    fill(128, 0, 128, 120); // 半透明紫色
    beginShape();
    for (let i = 0; i < lineIndices.length; i++) {
      let idx = lineIndices[i];
      let [x, y] = keypoints[idx];
      vertex(x, y);
    }
    // 反向補回 fillIndices，避免重疊
    for (let i = fillIndices.length - 1; i >= 0; i--) {
      let idx = fillIndices[i];
      let [x, y] = keypoints[idx];
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
