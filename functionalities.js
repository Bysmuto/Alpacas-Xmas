import { bgSound, winSound } from "./assets.js";
import { ref, db, get, update } from "./firebase.js";

const playBTn = document.getElementById("playBtn");
const snowContainer = document.querySelector(".snow");
const winnerRainContainer = document.querySelector("#winnerRain");

playBTn.onclick = () => {
  bgSound.play();
  nextPage("user");
};

function createSnowflake() {
  let chars = ["*", "*", "."];
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = chars[Math.floor(Math.random() * chars.length)];
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.fontSize = Math.random() * 10 + 25 + "px";
  snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
  snowflake.style.opacity = Math.random();

  snowContainer.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

function winnerRain() {
  let chars = ["🎁", "🎉","🎄", "🥳","*", "*", "*", "*", "*", "*", "*", "*", "*", "*", ];
  const snowflake = document.createElement("div");
  snowflake.classList.add("snowflake");
  snowflake.textContent = chars[Math.floor(Math.random() * chars.length)];
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.fontSize = Math.random() * 10 + 25 + "px";
  snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
  snowflake.style.opacity = Math.random();

  winnerRainContainer.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}

export function announceWinner(name, user) {
  const popup = document.getElementById("winnerPopup");
  clearInterval(snowDown);
  winnerRainContainer.style.display = " flex";
  winSound.play();

  get(ref(db, "MembersInfo")).then((snapshot) => {
    const data = snapshot.val();

    const { nome, endereço, telefone } = data[name];
    const info = `${"endereço: " + endereço + "/ nome: " + nome + "/ telefone: " + telefone}`;

    popup.innerHTML = `
    <h1>${name}</h1>
    <div class="info">
       <p>${nome}</p>
      <p>${endereço}</p>
      <p>${telefone}</p>
    </div>
     <button onclick="navigator.clipboard.writeText('${info}')">copiar info</button>
   
    `;

    popup.style.display = "flex";
  });

  update(ref(db,`Alpacas/${user}`), {
    hasPicked: true
  });
}

export function nextPage(page) {
  const playPage = document.getElementById("playPage");
  const userPage = document.getElementById("userPage");
  const wheelPage = document.getElementById("wheelPage");

  if (page === "user") {
    userPage.style.display = "flex";
    playPage.style.display = "none";
  }

  if (page === "wheel") {
    userPage.style.display = "none";
    wheelPage.style.display = "flex";
  }
}

let snowDown = setInterval(createSnowflake, 100);
setInterval(winnerRain, 100);
