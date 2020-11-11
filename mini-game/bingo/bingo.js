const _ = require("underscore");
const moment = require("moment");

const gameTypes = require("./gameTypes");
const symbols = require("../../constants/symbols");

const TelegramBot = require("../../bots/telegram");
const b = TelegramBot.boozecruiseBot;

const Bingo = require("../../models/mini-games/bingo/bingo");
const Ship = require("../../models/ship");

const RED = "🔴";
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
    ships: ship
      ? [
          {
            _id: ship._id,
            board: createBoard(),
          },
        ]
      : [],
  });
  return await bingo.save();
};

exports.getBoard = async (player) => {
  console.log(player);
  let bingo = await Bingo.findOne({ status: "playing", "ships._id": player._id });
  if (!bingo) {
    bingo = await Bingo.findOne({ status: "next" });
    if (!bingo) {
      bingo = await createGame(player);
    } else if (!_.some(bingo.ships, (ship) => ship._id == player._id)) {
      bingo.ships.push({
        _id: player._id,
        board: createBoard(),
      });
      await bingo.save();
    }
  }
  console.log(bingo.ships);
  const ship = _.find(bingo.ships, (ship) => ship._id == player._id);
  return { code: bingo.code, board: ship.board };
};

exports.stamp = async (code, player, location) => {
  const bingo = await Bingo.findOne({ code });
  if (!bingo) return `Bingo go boom boom -> ${code}`;
  else console.log(bingo.status);
  if (bingo.status === "finished") {
    return `This Bingo game is ${bingo.status}`;
  } else if (bingo.status !== "playing") {
    return `This Bingo game is ${bingo.status}. Starting in ${moment(bingo.date).toNow()} minutes`;
  } else {
    let shipIndex = _.findIndex(bingo.ships, (ship) => ship._id == player._id);
    if (shipIndex >= 0) {
      let square = bingo.ships[shipIndex].board[location.x][location.y];
      let message = "";
      if (square.status === GREEN) {
        return `${square.letter}${square.number} was already stamped!`;
      } else if (location.x === 2 && location.y === 2) {
        square.status = GREEN;
        message = "Free stamp WOOT";
      } else if (
        square.status !== RED &&
        _.some(bingo.balls, (ball) => ball.letter === square.letter && ball.number === square.number)
      ) {
        square.status = GREEN;
        message = `${square.letter}${square.number} stamped!`;
      } else if (!square.status) {
        square.status = YELLOW;
        message = "Cheater! Now, you'll have to remember the number!";
      } else if (square.status === YELLOW) {
        square.status = RED;
        message = "You've gone and mucked this one up now, it don't count no more";
      }
      await bingo.save();
      return message;
    } else {
      return "Ship not found in the current game";
    }
  }
};

exports.draw = async () => {
  const game = await Bingo.findOne({ status: "playing" });
  if (game) {
    if (game.balls.length < 75) {
      //Game is in process, not all balls pulled
      const ball = await draw(game);
      if (ball) {
        console.log(`Pulled ${ball.letter}${ball.number} - ${game.code} - ${game.balls.length} drawn`);
        const ships = await Ship.find({ _id: { $in: game.ships.map((ship) => ship._id) } });
        ships.forEach((ship) => b.sendMessage(ship.id, `<b>${ball.letter}-${ball.number}</b>`));
      }
    } else {
      //Game is finished, all balls pulled
      game.status = "finished";
      await game.save();
      let nextGame = await Bingo.findOne({ status: "next" });
      if (nextGame) {
        //There is a next game
        nextGame.status = "queued";
        nextGame.startTime = moment().add(2, "minutes");
        await nextGame.save();
        const ships = await Ship.find({ _id: { $in: nextGame.ships.map((ship) => ship._id) } });
        ships.forEach((ship) => b.sendMessage(ship.id, `Game ${nextGame.code} is starting in 2 minutes!`));
      } else {
        //There is no next game
        await createGame();
      }
    }
  } else {
    //There is no game being played
    const queuedGame = await Bingo.findOne({ status: "queued" });
    if (queuedGame) {
      //There is a queued game
      if (queuedGame.startTime <= moment()) {
        //The queued game will start
        queuedGame.status = "playing";
        await queuedGame.save();
      }
    } else {
      //There is no queued game
      const nextGame = await Bingo.findOne({ status: "next" });
      if (nextGame) {
        //There is a next game, queue it
        nextGame.status = "queued";
        nextGame.startTime = moment().add(2, "minutes");
        await nextGame.save();
      } else {
        //There is no next game, create one
        await createGame();
      }
    }
  }
};

const draw = async (bingo) => {
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

exports.addShip = async (ship) => {
  let bingo = await Bingo.findOne({ status: "next" });
  if (!bingo) {
    bingo = await createGame(ship);
  } else {
    bingo.ships.push({
      _id: ship._id,
      board: createBoard(),
    });
    await bingo.save();
  }
  return true;
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
