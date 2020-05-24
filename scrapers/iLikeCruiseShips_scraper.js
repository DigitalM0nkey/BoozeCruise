const cheerio = require("cheerio");
const axios = require("axios");
const moment = require("moment");
let articles = [];

console.log("Start I Like Cruise Ships Scraper");

const getILikeCruiseShipsArticles = (url) =>
  new Promise(function (resolve, reject) {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        // console.log($(".td-module-thumb > a").attr("href"));

        let urls = [];
        for (let i = 0; i < $(".td-module-thumb > a").length; i++) {
          urls.push($(".td-module-thumb > a")[i].attribs.href);
        }
        console.log(urls);

        return urls;
      })
      .then((urls) => {
        Promise.all(urls.map((url) => axios.get(url))).then((responses) => {
          resolve(
            responses.map((response) => {
              const $ = cheerio.load(response.data);
              //console.log("body: ", $(".td-post-content p").text());
              const image = $(".entry-thumb").attr("src")
                ? $(".entry-thumb").attr("src")
                : "https://github.com/DigitalM0nkey/BoozeCruise/blob/master/images/BoozeCruiseNews.jpg?raw=true";
              //console.log("ILCS IMGAR => ", image);

              return {
                date: $(`meta[property="og:updated_time"]`).attr("content")
                  ? moment($(`meta[property="og:updated_time"]`).attr("content")).fromNow()
                  : moment().startOf("day").fromNow(),
                source: `ilikecruiseships.com`,
                title: $("header > .entry-title").text(),
                image: image,
                body: $(".td-post-content p").text(),
              };
            })
          );
          console.log("End I Like Cruise Ships Scraper");
        });
      })
      .catch((err) => {
        console.log("SCRAPER ERROR =>", err);
        reject(err);
      });
  });

//getILikeCruiseShipsArticles("http://ilikecruiseships.com/category/news/");

module.exports = async () => {
  try {
    if (articles.length === 0) {
      articles = await getILikeCruiseShipsArticles("http://ilikecruiseships.com/category/news/");
    }
    return articles;
  } catch (err) {
    // catches errors both in fetch and response.json
    console.error(err);
  }
};
