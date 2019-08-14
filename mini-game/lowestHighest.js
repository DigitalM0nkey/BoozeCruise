let house = 0;
let player1 = 0;
let player2 = 0;

const roll = function numbers(player1Guess, player2Guess) {
  house = Math.floor(Math.random() * 100);
  if (player1Guess === player2Guess) {
    console.log("House Wins! \nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
  } else if (house < player1Guess && house < player2Guess) {
    console.log("House Wins! \n\n House picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
  } else if (house > player1Guess || house > player2Guess) {
    if (player1 > player2) {
      console.log("Player 1 Wins! \n\n House picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
    } else {
      console.log("Player 2 Wins! \n\n House picked: " + house + "\nPlayer 1 guessed: " + player1Guess + "\nPlayer 2 guessed: " + player2Guess);
    }
  }
  console.log(house);


}

roll(6, 6);
roll(8, 68);
roll(22, 3);
roll(99, 12);
roll(98, 50);
