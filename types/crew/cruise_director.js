module.exports = {
  conversation: (input) => {
    if (!input) {
      return `Hi, I'm your Cruise Director, What do you need help with today?`;
    } else if (input.checkString("pool")) return `The pool is that-a-way 💪 👉`;
    else if (input.checkString("name") && input.checkString("your")) return `My name is Jared Burns`;
    else if (input.checkString("fuck") || input.checkString("fucking"))
      return `Language....Please....There are children onboard.` || `Holy shit... No fucking way!`;
  },
};
