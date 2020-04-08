const symbols = ["🍒","⚓️","🛳","🏝","🌊","☀️"];

const slots = (bet, odds) => {
  const house = new Array(odds);
  for (let i = 0; i < odds; i++ ){
      house[i] =  symbols[Math.floor(Math.random() * odds)];
      console.log(house[i]);
  }
  document.getElementById("slots").innerHTML = "SLOTS";
};

slots(5, 3);
