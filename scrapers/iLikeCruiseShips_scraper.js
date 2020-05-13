const cheerio = require("cheerio");
const axios = require("axios");
let articles = [];

const getILikeCruiseShipsArticles = (url) =>
  new Promise(function (resolve, reject) {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        // console.log($(".td-module-thumb > a").attr("href"));

        let urls = [];
        for (let i = 1; i < $(".td-module-thumb > a").length; i++) {
          urls.push($(".td-module-thumb > a")[i].attribs.href);
        }
        //console.log(urls);

        return urls;
      })
      .then((urls) => {
        Promise.all(urls.map((url) => axios.get(url))).then((responses) => {
          resolve(
            responses.map((response) => {
              const $ = cheerio.load(response.data);
              //console.log("body: ", $(".td-post-content p").text());

              return {
                image: $(".entry-thumb").attr("src"),
                title: $("header > .entry-title").text(),
                body: $(".td-post-content p").text(),
              };
            })
          );
        });
      })
      .catch((err) => {
        console.log("SCRAPER ERROR =>", err);
        reject(err);
      });
  });

//getILikeCruiseShipsArticles("http://ilikecruiseships.com/category/news/");

module.exports = async () => {
  if (articles.length === 0) {
    articles = await getILikeCruiseShipsArticles("http://ilikecruiseships.com/category/news/");
  }
  return articles;
};
