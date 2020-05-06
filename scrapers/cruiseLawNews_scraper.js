const rp = require("request-promise");
const $ = require("cheerio");
const cruiseLawNewsArticle = require("./cruiseLawArticles");
const url = "https://www.cruiselawnews.com/";

rp(url)
  .then(function (html) {
    //success!
    //console.log(html);
    //console.log($("h1 > a", html).length);
    // console.log($("h1 > a", html));
    // console.log($("h1 > a", html).text());
    const urls = [];
    for (let i = 1; i < 11; i++) {
      urls.push($("h1 > a", html)[i].attribs.href);
    }
    // console.log("URLS => ", urls);

    return Promise.all(
      urls.map((url) => {
        //console.log("scraper url => ", url);

        return cruiseLawNewsArticle(url);
      })
    );
    //console.log(urls);
  })
  .then(function (articles) {
    console.log("articles =>", articles);
  })
  .catch(function (err) {
    console.log("SCRAPER ERROR =>", err);

    //handle error
  });
