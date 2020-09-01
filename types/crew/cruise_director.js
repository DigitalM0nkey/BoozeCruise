module.exports = {
  conversation: (input) => {
    if (!input) {
      return `Hi, I'm your Cruise Director, What do you need help with today?`;
    } else if (input.checkString("pool")) return `The pool is that-a-way 💪 👉`;
  },
};
