module.exports = {
  conversation: (input) => {
    //const trigger = `${input}.checkString`;
    if (!input) return `Hi, I'm your Cruise Director, What do you need help with today?`;
    else if (trigger("pool")) return `The pool is that-a-way 💪 👉`;
    else if (trigger("pool")) return `The pool is that-a-way 💪 👉`;
    else if (trigger("hello") || trigger("hi")) return `👋`;
    else if (trigger("name") && trigger("your")) return `My name is Jared Burns`;
    else if (trigger("you") && trigger("are") && trigger("there"));
    else if (trigger("how") && trigger("are") && trigger("you"))
      return `I live and work on a cruise ship... Life is amazing!`;
    else if (trigger("fuck") || trigger("fucking"))
      return [
        `Language....Please....There are children onboard.`,
        `Holy shit... No fucking way!`,
        `Oh, Donkey balls`,
      ].getRandom();
    else return "";
  },

  trigger: (input) => {
    input.checkString(input);
  },
};

const trigger = (input) => {
  input.checkString(input);
};
