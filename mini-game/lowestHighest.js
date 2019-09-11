module.exports = function (house, player1, player2) {

  let message = "House picked: " + house + "\n" + player1.name + " guessed: " + player1.guess + "\n" + player2.name + " guessed: " + player2.guess;

  let title = "<pre>Lowest-Highest Results</pre>\n\n";

  if (player1.guess === player2.guess) {
    return { message: "<b>House Wins!</b>\nPLAYER DRAW\n" + message };
  } else if (house < player1.guess && house < player2.guess) {
    return { message: "<b>House Wins!</b>\n" + message };
  } else if (house > player1.guess || house > player2.guess) {
    if (player1.guess > player2.guess && player1.guess < house) {
      return {
        message: title + "<b>" + player1.name + " Wins!</b>\n" + message,
        winner: player1.id
      };
    } else if (player2.guess > player1.guess && player2.guess < house) {
      return {
        message: title + "<b>" + player2.name + " Wins!</b>\n" + message,
        winner: player2.id
      };
    } else if (house > player1.guess && player2.guess > house) {
      return {
        message: title + "<b>" + player1.name + " Wins!</b>\n" + message,
        winner: player1.id
      };
    } else if (house > player2.guess && player1.guess > house) {
      return {
        message: title + "<b>" + player2.name + " Wins!</b>\n" + message,
        winner: player2.id
      };
    }
  } else if (house === player1.guess) {
    //JACKPOT PLAYER 1
    return {
      message: title + "<b>---- JACKPOT " + player1.name + " ----</b>\n" + message,
      winner: player1.id,
      jackpot: true
    };
  } else if (house === player2.guess) {
    //JACKPOT PLAYER 2
    return {
      message: title + "<b>---- JACKPOT " + player2.name + " ----</b>\n" + message,
      winner: player2.id,
      jackpot: true
    };
  }
}