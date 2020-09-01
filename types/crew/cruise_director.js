module.exports = {
  conversation: (input) => {
    if (!input) {
      return `Hi, I'm your Cruise Director, What do you need help with today?`;
    } else if (input) return `You said ${input}`;
  },
};
