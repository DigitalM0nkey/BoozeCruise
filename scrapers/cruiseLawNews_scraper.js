const rp = require("request-promise");
const $ = require("cheerio");
const url = "https://www.cruiselawnews.com/";

rp(url)
  .then(function (html) {
    //success!
    console.log(html);
    console.log($("h1 > a", html).length);
    console.log($("h1 > a", html));
  })
  .catch(function (err) {
    //handle error
  });
