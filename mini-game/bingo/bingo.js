const gameTypes = require("./gameTypes");
const symbols = require("../../constants/symbols");
const Bingo = require('../../models/mini-games/bingo/bingo');

const balls = {
  B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  I: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  N: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  G: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
  O: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
};

const createGame = () => {
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += symbols[Math.floor(Math.random()*symbols.length)];
  }
  let bingo = new Bingo({
    code,
    gameType: gameTypes[Math.floor(Math.random()*gameTypes.length)];
  });
}

const checkBoard = (gameType, playerBoard) => {
  let bingo;
  for (const board of gameTypes[gameType].boards) {
    bingo = true;
    for (let i in board) {
      for (let j in board[i]) {
        if (board[i][j] === 1 && !playerBoard[i][j].stamped) {
          bingo = false;
          break;
        }
      }
      if (!bingo) break;
    }
    if (bingo) break;
  }
  return bingo;
};

exports.createBoard = () => {
  let board = [[], [], [], [], []];
  let i = 0;
  for (let letter in balls) {
    for (let j = 0; j < 5; j++) {
      if (letter === "N" && j === 2) {
        board[i].push({
          name: "FREE",
          letter: "N",
          number: 0,
          stamped: true,
        });
      } else {
        const availableNumbers = balls[letter].filter(
          (number) => !board[i].some((cell) => cell.number === number)
        );
        const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        board[i].push({
          name: `${letter}${randomNumber}`,
          letter: letter,
          number: randomNumber,
          stamped: false,
        });
      }
    }
    i++;
  }
  return board;
};
