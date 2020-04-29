
  const bingo = {
    B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    I: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    N: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    G: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    O: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]
  };
  exports.createBoard = () => {
    let board = {
      B: [],
      I: [],
      N: [],
      G: [],
      O: []
    };
    for (let letter in bingo) {
      for (let j = 0; j < 5; j++) {
        if (letter === 'N' && j === 2) {
          board[letter].push({
            name: 'FREE',
            number: 0,
            stamped: true
          });
        } else {
          const availableNumbers = bingo[letter].filter(number => board[letter].indexOf(number) < 0);
          console.log(availableNumbers);
          const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
          board[letter].push({
            name: `${letter}${randomNumber}`,
            number: randomNumber,
            stamped: false
          });
        }
      }
    }
    return board;
  };
