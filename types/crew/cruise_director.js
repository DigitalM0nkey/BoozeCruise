module.exports = {
  conversation: (input) => {
    if (!input) {
      `Hi, I'm your Cruise Director, What do you need help with today?`;
    } else if (input) `You said ${input}`;
  },
};
