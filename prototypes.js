Array.prototype.getRandom = function (n) {
  let result = new Array(n),
    len = this.length,
    taken = new Array(len);
  if (!n) n = 1;
  if (n > len) n = len;
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = this[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

String.prototype.checkString = function (str) {
  console.log("this", this);
  console.log("typeof", typeof this);
  return this.toString()
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(" ")
    .includes(str);
};
