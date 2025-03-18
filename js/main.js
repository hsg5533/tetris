var shapeColor,
  shapeColorIndex,
  nextColorIndex,
  movingThread,
  movingSpeed,
  shapeCell,
  existField,
  shapePoint,
  currentShape,
  nextShape,
  score,
  level,
  bg = new Audio("./audio/bradinsky.mp3"),
  copyright = "Copyright (c) 2020 YJYOON All rights reserved.",
  H = 34,
  W = 20,
  shapeArray = [
    [
      [2, 2],
      [1, 2],
      [1, 1],
      [0, 1],
    ],
    [
      [1, 1],
      [1, 0],
      [0, 2],
      [0, 1],
    ],
    [
      [2, 1],
      [1, 1],
      [1, 2],
      [0, 2],
    ],
    [
      [1, 2],
      [1, 1],
      [0, 1],
      [0, 0],
    ],
    [
      [1, 2],
      [1, 1],
      [0, 2],
      [0, 1],
    ],
    [
      [2, 0],
      [1, 1],
      [1, 0],
      [0, 0],
    ],
    [
      [1, 1],
      [0, 2],
      [0, 1],
      [0, 0],
    ],
    [
      [2, 2],
      [1, 2],
      [1, 1],
      [0, 2],
    ],
    [
      [1, 2],
      [1, 1],
      [1, 0],
      [0, 1],
    ],
    [
      [3, 1],
      [2, 1],
      [1, 1],
      [0, 1],
    ],
    [
      [1, 3],
      [1, 2],
      [1, 1],
      [1, 0],
    ],
    [
      [2, 2],
      [2, 1],
      [1, 1],
      [0, 1],
    ],
    [
      [1, 0],
      [0, 2],
      [0, 1],
      [0, 0],
    ],
    [
      [2, 2],
      [1, 2],
      [0, 2],
      [0, 1],
    ],
    [
      [1, 2],
      [1, 1],
      [1, 0],
      [0, 2],
    ],
    [
      [2, 2],
      [2, 1],
      [1, 2],
      [0, 2],
    ],
    [
      [2, 2],
      [2, 1],
      [2, 0],
      [1, 0],
    ],
    [
      [2, 1],
      [1, 1],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 2],
      [0, 2],
      [0, 1],
      [0, 0],
    ],
  ],
  shapeRotateMap = [
    1, 0, 3, 2, 4, 6, 7, 8, 5, 10, 9, 12, 13, 14, 11, 16, 17, 18, 15,
  ],
  shapeColorArray = [
    "rgb(199,82,82)",
    "rgb(233,174,43)",
    "rgb(105,155,55)",
    "rgb(53,135,145)",
    "rgb(49,95,151)",
    "rgb(102,86,167)",
  ],
  tileColor = "rgb(9,17,26)",
  wallColor = "rgb(22,41,63)",
  fastMode = !1,
  initSpeed = 500,
  deltaSpeed = 40,
  fastSpeed = 25,
  createPoint = [1, parseInt(W / 2) - 2],
  levelStack = 0,
  isPaused = !1;
function keyDownEventHandler(e) {
  switch (e.keyCode) {
    case 37:
      setTimeout("moveLR(-1)", 0);
      break;
    case 39:
      setTimeout("moveLR(1)", 0);
      break;
    case 32:
      setTimeout("rotateShape()", 0);
      break;
    case 40:
      moveFast();
      break;
    case 80:
      pause();
  }
}
function keyUpEventHandler(e) {
  40 == e.keyCode && moveSlow();
}
function playbg() {
  (bg.loop = !0), (bg.muted = !0), bg.play(), (bg.muted = !1);
}
function pausebg() {
  bg.pause();
}
function init() {
  playbg(),
    drawField(),
    initExistField(),
    setWall(),
    (nextColorIndex = -1),
    (movingSpeed = initSpeed),
    (shapeCell = []),
    (shapePoint = [1, 1]),
    (score = 0),
    (level = 1),
    chooseNextShape(),
    chooseNextColor(),
    createShape();
}
function gebi(e, o) {
  return document.getElementById(String(e) + " " + String(o));
}
function initExistField() {
  existField = Array(H);
  for (var e = 0; e < H; e++) existField[e] = Array(W);
  for (var e = 0; e < H; e++) for (var o = 0; o < W; o++) existField[e][o] = !1;
}
function drawField() {
  for (var e = '<table id="gameTable" border=0>', o = 0; o < H; o++) {
    e += "<tr>";
    for (var a = 0; a < W; a++)
      e += '<td id="' + String(o) + " " + String(a) + '"></td>';
    e += "</tr>";
  }
  document.write(e);
}
function setWall() {
  for (var e = 0; e < H; e++)
    (gebi(e, 0).style.background = wallColor),
      (gebi(e, W - 1).style.background = wallColor),
      (existField[e][0] = !0),
      (existField[e][W - 1] = !0);
  for (var e = 0; e < W; e++)
    (gebi(0, e).style.background = wallColor),
      (gebi(H - 1, e).style.background = wallColor),
      (existField[0][e] = !0),
      (existField[H - 1][e] = !0);
}
function chooseNextShape() {
  nextShape = parseInt(Math.random() * shapeArray.length);
}
function chooseNextColor() {
  ++nextColorIndex == shapeColorArray.length && (nextColorIndex = 0);
}
function createShape() {
  (shapePoint[0] = createPoint[0]),
    (shapePoint[1] = createPoint[1]),
    (currentShape = nextShape),
    (shapeColor = shapeColorArray[(currentColorIndex = nextColorIndex)]);
  var e = shapeArray[currentShape];
  chooseNextShape(), chooseNextColor(), displayNextShape();
  for (var o = 0; o < e.length; o++) {
    var a = shapePoint[0] + e[o][0],
      t = shapePoint[1] + e[o][1];
    isValidPoint(a, t) || gameOver(),
      (gebi(parseInt(a), parseInt(t)).style.background = shapeColor),
      shapeCell.push([a, t]);
  }
  levelStack++,
    leveling(),
    (movingThread = setTimeout("moveDown()", movingSpeed));
}
function displayNextShape() {
  initNextTable();
  for (
    var e = shapeArray[nextShape], o = shapeColorArray[nextColorIndex], a = 0;
    a < 4;
    a++
  ) {
    var t = e[a][0],
      n = e[a][1];
    document.getElementById(String(t) + String(n)).style.background = o;
  }
}
function initNextTable() {
  for (var e = 0; e < 4; e++)
    for (var o = 0; o < 4; o++)
      document.getElementById(String(e) + String(o)).style.background =
        "rgb(14,31,49)";
}
function moveDown() {
  if (!canMove(1, 0)) {
    commitExist(), checkLine(), (shapeCell = []), createShape();
    return;
  }
  removeShape();
  for (var e = 0; e < shapeCell.length; e++) shapeCell[e][0]++;
  shapePoint[0]++,
    showShape(),
    (movingThread = setTimeout("moveDown()", movingSpeed));
}
function rotateShape() {
  if (canRotate()) {
    removeShape(), (shapeCell = []);
    for (
      var e = shapeArray[(currentShape = shapeRotateMap[currentShape])], o = 0;
      o < 4;
      o++
    ) {
      var a = shapePoint[0] + e[o][0],
        t = shapePoint[1] + e[o][1];
      shapeCell.push([a, t]);
    }
    showShape();
  }
}
function canRotate() {
  for (var e, o = shapeArray[shapeRotateMap[currentShape]], a = 0; a < 4; a++) {
    if (!isValidPoint(shapePoint[0] + o[a][0], shapePoint[1] + o[a][1]))
      return !1;
  }
  return !0;
}
function isValidPoint(e, o) {
  return !(e <= 0 || e >= H - 1 || o <= 0 || o >= W - 1 || existField[e][o]);
}
function removeShape() {
  for (var e = 0; e < shapeCell.length; e++)
    gebi(shapeCell[e][0], shapeCell[e][1]).style.background = tileColor;
}
function showShape() {
  for (var e = 0; e < shapeCell.length; e++)
    gebi(shapeCell[e][0], shapeCell[e][1]).style.background = shapeColor;
}
function canMove(e, o) {
  for (var a, t = 0; t < shapeCell.length; t++) {
    if (!isValidPoint(shapeCell[t][0] + e, shapeCell[t][1] + o)) return !1;
  }
  return !0;
}
function moveLR(e) {
  if (canMove(0, e) && !isPaused) {
    removeShape();
    for (var o = 0; o < shapeCell.length; o++) shapeCell[o][1] += e;
    (shapePoint[1] += e), showShape();
  }
}
function moveFast() {
  fastMode ||
    (clearTimeout(movingThread),
    (movingThread = setTimeout("moveDown()", (movingSpeed = fastSpeed))),
    (fastMode = !0));
}
function moveSlow() {
  fastMode &&
    (clearTimeout(movingThread),
    (movingThread = setTimeout(
      "moveDown()",
      (movingSpeed = initSpeed - level * deltaSpeed)
    )),
    (fastMode = !1));
}
function commitExist() {
  for (var e = 0; e < shapeCell.length; e++) {
    var o = shapeCell[e][0],
      a = shapeCell[e][1];
    existField[o][a] = !0;
  }
}
function checkLine() {
  for (var e = 100 * level, o = 0, a = 0, t = H - 2; t > 1; t--)
    isFull(t) && (removeLine(t), t++, (a += updateScore(e, ++o))),
      o > 0 && displayCombo(o, a);
}
function isFull(e) {
  for (var o = 1; o < W - 1; o++) if (!existField[e][o]) return !1;
  return !0;
}
function removeLine(e) {
  for (var o = e - 1; o >= 1; o--)
    for (var a = 1; a < W - 1; a++)
      (gebi(o + 1, a).style.background = gebi(o, a).style.background),
        (existField[o + 1][a] = existField[o][a]);
}
function leveling() {
  10 != level &&
    (levelStack != 10 * level ||
      (level++,
      (levelStack = 0),
      fastMode || (movingSpeed = initSpeed - level * deltaSpeed)),
    (document.getElementById("level").innerHTML = level));
}
function updateScore(e, o) {
  var a = e * o;
  return (score += a), (document.getElementById("score").innerHTML = score), a;
}
function displayCombo(e, o) {
  (document.getElementById("comboField").innerHTML = e + " COMBO +" + o),
    setTimeout(function () {
      document.getElementById("comboField").innerHTML = "";
    }, 700);
}
function gameOver() {
  pausebg(),
    clearTimeout(movingThread),
    initExistField(),
    alert("[Game Over]\nLevel: " + level + "\nScore: " + score),
    (document.getElementById("gameField").style.visibility = "hidden"),
    (document.getElementById("gameover").style.visibility = "visible");
}
function pause() {
  isPaused
    ? (playbg(),
      (movingThread = setTimeout("moveDown()", movingSpeed)),
      (document.getElementById("pause").style.visibility = "hidden"),
      (document.getElementById("gameField").style.visibility = "visible"),
      (isPaused = !1))
    : (pausebg(),
      clearTimeout(movingThread),
      (document.getElementById("gameField").style.visibility = "hidden"),
      (document.getElementById("pause").style.visibility = "visible"),
      (isPaused = !0));
}
function info() {
  alert(copyright);
}
init(),
  (document.onkeydown = keyDownEventHandler),
  (document.onkeyup = keyUpEventHandler);
