module.exports = {
  conversation: (input) => {
    if (!input) return `Hi, I'm your Cruise Director, What do you need help with today?`;
    else if (input.checkString("pool")) return `The pool is that-a-way 💪 👉`;
    else if (input.checkString("bingo")) return `Go to the lounge to play BINGO`;
    else if (input.checkString("slots"))
      return `You can play the slots in the casino, which is only open while you are sailing`;
    else if (input.checkString("what can you do"))
      return `You can ask me to help you with the following: \n- Pool \n- BINGO \n- Slots \n- My name`;
    else if (input.checkString("hello") || input.checkString("hi")) return `👋`;
    else if (input.checkString("name") && input.checkString("your")) return `My name is Jared Burns`;
    // else if (input.checkString("you") && input.checkString("are") && input.checkString("there"))
    //   return `I live and work on a cruise ship... Life is amazing!`;
    else if (input.checkString("how") && input.checkString("are") && input.checkString("you"))
      return `I live and work on a cruise ship... Life is amazing!`;
    else if (input.checkString("fuck") || input.checkString("fucking"))
      return [
        `Language....Please....There are children onboard.`,
        `Holy shit... No fucking way!`,
        `Oh, Donkey balls`,
      ].getRandom();
    else return "";
  },
};

// const intro = {
//   welcome: `Welcome aboard! I'm your Cruise Director, Terrence.
//   It may seem a little overwhelming at first, but together we'll explore your new ship.`,

//   traveling: `Let's talk about traveling. Traveling is an essential part of the game. There are 11 ports, across 9 different continents that you can visit.
//   Once you arrive in port, some of your guests/passengers will disembark (get off) your ship, but not to worry as new guests will embark (board) your ship. You will also receive some ${KORONA} (in-game currency) for each guest that joins

//   Traveling occers in real time, that means when it says it is going to take 48 hours for you to reach your destination, it really will take you 2 days to sail there. Just like on a real cruise ship, once you are sailing, the real fun begins.

//   You will notice that while you are sailing, your Deck Plan will have different options that were not previously available to you. For example, The 'casino' is only available while you are sailing`,

//   casino: `The casino is a great place to win some ${KORONA}, play against other players in a game of Lowest-Highest or try your luck on the emoji slots.`,
// };
