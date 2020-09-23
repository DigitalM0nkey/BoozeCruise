module.exports = {
  conversation: (input) => {
    if (!input) return `Hi, I'm your Cruise Director, What do you need help with today?`;
    else if (input.checkString("pool")) return `The pool is that-a-way 💪 👉`;
    else if (input.checkString("bingo")) return `Go to the lounge to play BINGO`;
    else if (input.checkString("slots"))
      return `You can play the slots in the casino, which is only open while you are sailing`;
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
