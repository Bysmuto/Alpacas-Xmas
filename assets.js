const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
let tickBuffer = null
const gainNode = audioCtx.createGain()
gainNode.gain.value = 0.2 

fetch("./sounds/tick.mp3")
  .then(res => res.arrayBuffer())
  .then(b => audioCtx.decodeAudioData(b))
  .then(buf => (tickBuffer = buf))

function playTick() {
  if (!tickBuffer) return
  const src = audioCtx.createBufferSource()
  src.buffer = tickBuffer
  src.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  src.start()
}


const bgSound = new Audio("./sounds/music.mp3");
bgSound.volume = 0.09;
bgSound.loop = true;

const preRollSound = new Audio("./sounds/preRoll.mp3");
preRollSound.volume = 0.4;

const winSound = new Audio("./sounds/win.mp3");

export { playTick, winSound, bgSound, preRollSound };
