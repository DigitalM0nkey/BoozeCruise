let house = 0;
let player1 = 0;
let player2 = 0;

const roll = function numbers(player1Guess, player2Guess) {
  house = Math.floor(Math.random() * 100);
  if (player1Guess === player2Guess) {
    console.log("House Wins! \n Player 1 guessed " + player1guess + " & Player 2 guessed " + player2Guess);
  }
  console.log(house);


}

roll(6, 6);