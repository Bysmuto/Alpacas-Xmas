// import {playTick,winSound,bgSound} from "/assets.js";

const spinBtn = document.getElementById("spin");
const playBTn = document.getElementById("playBtn");

function nextPage(page) {
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

playBTn.onclick = () => {

//   bgSound.play();
  nextPage("user");
};

    const snowContainer = document.querySelector(".snow");
    const playBtn = document.querySelector("#playBtn");
    

  
 
    function createSnowflake() {
      const snowflake = document.createElement("div");
      snowflake.classList.add("snowflake");
      snowflake.textContent = "*";
      snowflake.style.left = Math.random() * 100 + "vw";
      snowflake.style.fontSize = Math.random() * 10 + 15 + "px";
      snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
      snowflake.style.opacity = Math.random();

      snowContainer.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 5000);
    }

    setInterval(createSnowflake, 100);


export{nextPage}
