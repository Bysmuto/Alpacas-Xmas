const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let tickBuffer = null;
let gainNode = audioCtx.createGain();
gainNode.gain.value = 0.1;
fetch("/sounds/tick.mp3")
  .then((res) => res.arrayBuffer())
  .then((b) => audioCtx.decodeAudioData(b))
  .then((buf) => (tickBuffer = buf));

function playTick() {
  if (!tickBuffer) return;
  const src = audioCtx.createBufferSource();
  src.buffer = tickBuffer;
  src.connect(audioCtx.destination);
  src.start();
}

const bgSound = new Audio("/sounds/music.mp3");
bgSound.volume = 0.1;

const preRollSound = new Audio("/sounds/preRolL.mp3");
preRollSound.volume = 0.4;

const winSound = new Audio("/sounds/win.mp3");

export { playTick, winSound, bgSound, preRollSound };
