let house = 0;
let player1 = 0;
let player2 = 0;

const roll = function numbers(player1Guess, player2Guess) {
  house = Math.floor(Math.random() * 100);
  if (player1Guess === player2Guess) {
    console.log("\nHouse Wins!\nPLAYER DRAW\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
  } else if (house < player1Guess && house < player2Guess) {
    console.log("\nHouse Wins!\nHouse picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
  } else if (house > player1Guess || house > player2Guess) {
    if (player1 > player2 && player1 < house) {
      console.log("\nPlayer 1 Wins!\nHouse picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
    } else if (player2 > player1 && player2 < house) {
      console.log("\nPlayer 2 Wins!\nHouse picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
    } else {
      console.log("\nHouse Wins!\nHouse picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
    }
    // console.log(house);

    // console.log("If it makes it here, Check your rule. maybe you need an else statment");
  }



}

roll(6, 6);
roll(8, 68);
roll(22, 3);
roll(99, 12);
roll(98, 50);
