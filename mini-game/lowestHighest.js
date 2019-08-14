import { lstat } from "fs";

let house = 0;
let player1 = 0;
let player2 = 0;

const roll = function numbers(player1Guess, player2Guess) {
  house = Math.floor(Math.random() * 100);
  console.log(house);


}