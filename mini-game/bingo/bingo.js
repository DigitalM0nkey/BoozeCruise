const _ = require("underscore");

const gameTypes = require("./gameTypes");
const symbols = require("../../constants/symbols");
const Bingo = require("../../models/mini-games/bingo/bingo");

const RED = "";
const YELLOW = "🟡";
const GREEN = "🟢";

/*
Every 10 seconds a new number is pulled
All Ships participating will get the number
It will evaluate all declared bingos
All valid bingos win
If all 75 numbers are called without bingos, new game starts
Full game without winners = 750 seconds
Waits 150 seconds for next game
Warn players the new game will start
*/

const balls = {
  B: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  I: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  N: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  G: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
  O: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
};

const createGame = async (ship) => {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += symbols[Math.floor(Math.random() * symbols.length)];
  }
  let bingo = new Bingo({
    code,
    gameType: gameTypes[Math.floor(Math.random() * gameTypes.length)],
    status: "next",
    balls: [],
    ships: [
      {
        _id: ship._id,
        board: createBoard(),
      },
    ],
  });
  return await bingo.save();
};

exports.getBoard = async (player) => {
  let bingo = await Bingo.findOne({ status: "playing", "ships._id": player._id });
  if (!bingo) {
    bingo = await Bingo.findOne({ status: "next" });
    if (!bingo) {
      bingo = await createGame(player);
    } else if (!_.some(bingo.ships, (ship) => ship._id === player._id)) {
      bingo.ships.push({
        _id: player._id,
        board: createBoard(),
      });
      await bingo.save();
    }
  }
  return _.find(bingo.ships, (ship) => ship._id === player._id).board;
};

exports.stamp = async (code, player, location) => {
  const bingo = await Bingo.findOne({ code });
  let playerBoard = _.find(bingo.ships, (ship) => ship._id === player._id);
  let square = playerBoard[location.x][location.y];
  if (location.x === 2 && location.y === 2) {
    square.status = GREEN;
  } else if (
    square.status !== RED &&
    _.some(bingo.balls, (ball) => ball.letter === square.letter && ball.number === square.number)
  ) {
    square.status = GREEN;
  } else if (!square.status) {
    square.status = YELLOW;
  } else if (square.status === YELLOW) {
    square.status = RED;
  }
  await bingo.save();
};

exports.draw = async (bingo) => {
  if (!bingo || (bingo.balls && bingo.balls.length >= 75)) return;
  let ball;
  while (!ball) {
    const randomBall = pickBall();
    if (!_.some(bingo.balls, (ball) => randomBall.letter === ball.letter && randomBall.number === ball.number)) {
      ball = randomBall;
    }
  }
  bingo.balls.push(ball);
  await bingo.save();
  return ball;
};

const pickBall = () => {
  const letter = Object.keys(balls).getRandom(1)[0];
  const number = balls[letter].getRandom(1)[0];
  return {
    letter,
    number,
  };
};

const addShip = async (code, ship) => {
  let bingo = await Bingo.findOne({ code });
  if (!bingo) bingo = await createGame(ship);
  else
    bingo.ships.push({
      _id: ship._id,
      board: createBoard(),
    });
  return await bingo.save();
};

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

const createBoard = () => {
  let board = [[], [], [], [], []];
  let i = 0;
  for (let letter in balls) {
    for (let j = 0; j < 5; j++) {
      if (letter === "N" && j === 2) {
        board[i].push({
          name: "FREE",
          letter: "N",
          number: 0,
          status: null,
        });
      } else {
        const availableNumbers = balls[letter].filter((number) => !board[i].some((cell) => cell.number === number));
        const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        board[i].push({
          name: `${letter}-${randomNumber}`,
          letter: letter,
          number: randomNumber,
          status: null,
        });
      }
    }
    i++;
  }
  return board;
};

exports.createBoard = createBoard;
exports.createGame = createGame;
