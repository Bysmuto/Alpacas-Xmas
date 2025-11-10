import { ref, db, get } from "./firebase.js";
import { playTick, preRollSound } from "./assets.js";
import { nextPage, announceWinner } from "./functionalities.js";

const spinBtn = document.getElementById("spin");

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let currentRotation = 0;
let isSpinning = false;
let dataCache, names, user, winner;

function drawWheel(names) {
  //config
  const colors = ["#da1021ff", "#2ab91dff"];
  const font = 'bold 16px "Silkscreen"';
  const centerClose = 3.9;
  const lineColor = "#1b1010ff";
  const scale = 0.32;
  const lineWidth = 8;

  let r = 200;

  const offCanvas = document.createElement("canvas");
  offCanvas.width = canvas.width * scale;
  offCanvas.height = canvas.height * scale;
  const offCtx = offCanvas.getContext("2d");

  const centerXOff = offCanvas.width / 2;
  const centerYOff = offCanvas.height / 2;
  const radiusOff = r * scale;
  const anglePerSegment = (2 * Math.PI) / names.length;

  for (let i = 0; i < names.length; i++) {
    const startAngle = i * anglePerSegment + currentRotation - Math.PI / 2;
    const endAngle = (i + 1) * anglePerSegment + currentRotation - Math.PI / 2;

    offCtx.beginPath();
    offCtx.arc(centerXOff, centerYOff, radiusOff, startAngle, endAngle);
    offCtx.lineTo(centerXOff, centerYOff);
    offCtx.fillStyle = colors[i % colors.length];
    offCtx.fill();
    offCtx.strokeStyle = lineColor;
    offCtx.lineWidth = lineWidth * scale;
    offCtx.stroke();
  }

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    offCanvas,
    0,
    0,
    offCanvas.width,
    offCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = r;
  ctx.font = font;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (let i = 0; i < names.length; i++) {
    const startAngle = i * anglePerSegment + currentRotation - Math.PI / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.fillText(names[i], radius / centerClose, 0);
    ctx.restore();
  }
}

function spin(Winner, names) {
  if (isSpinning || !Winner || !user) return;

  isSpinning = true;
  spinBtn.disabled = true;

  const spins = 12;
  const spinDuration = spins * 2000;

  const anglePerSegment = (2 * Math.PI) / names.length;
  const randomOffset = (Math.random() - 0.5) * anglePerSegment * 0.9;
  const targetRotation =
    ((names.length - names.indexOf(Winner) - 1) * anglePerSegment +
      anglePerSegment / 2 +
      randomOffset) %
    (2 * Math.PI);
  const totalRotation = spins * 2 * Math.PI + targetRotation;
  const startRotation = 0;
  currentRotation = 0;
  const startTime = Date.now();

  let lastSliceIndex = null;

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / spinDuration, 1);

    const easeInOut =
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    currentRotation = startRotation + easeInOut * totalRotation;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel(names);

    // tick sync
    const sliceIndex = Math.floor((-currentRotation / anglePerSegment) % names.length);
    const normalizedIndex = (sliceIndex + names.length) % names.length;
    if (normalizedIndex !== lastSliceIndex) {
      playTick();
      lastSliceIndex = normalizedIndex;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      spinBtn.disabled = true;
      announceWinner(`${Winner}`, user);
    }
  }

  animate();
}

function userSelect(names, data) {
  const usersDiv = document.getElementById("usersDiv");

  let possibleUser = data
    .filter((p) => p[1].participant === true)
    .filter((p) => p[1].hasPicked === false)
    .map((p) => p[0]);

  names.forEach((name) => {
    const btn = document.createElement("button");
    btn.textContent = name;
    if (possibleUser.includes(name)) {
      btn.onclick = () => {
        user = name;
        winner = dataCache.find(([name]) => name === user)[1].secretSanta;
        // console.log(user + "->" + winner);
        nextPage("wheel");
      };
    }

    usersDiv.appendChild(btn);
  });
}

spinBtn.onclick = () => {
  preRollSound.play();

  setTimeout(() => {
    spin(winner, names);
  }, 1200);
};

get(ref(db, "Alpacas")).then((snapshot) => {
  if (snapshot.exists()) {
    const data = Object.entries(snapshot.val());
    names = data.map((p) => p[0]);
    dataCache = data;
    drawWheel(names);
    userSelect(names, data);
  }
});
