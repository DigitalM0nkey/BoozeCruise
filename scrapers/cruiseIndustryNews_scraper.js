const cheerio = require("cheerio");
const axios = require("axios");
const moment = require("moment");
let articles = [];
const site = "https://www.cruiseindustrynews.com";

console.log("Start Cruise Industry News");

const getCruiseIndustryNews = (url) =>
  new Promise(function (resolve, reject) {
    axios
      .get(url)
      .then((response) => {
        const $ = cheerio.load(response.data);
        // console.log($(".td-module-thumb > a").attr("href"));

        let urls = [];
        for (let i = 1; i < $(".allmode-items > li").length; i++) {
          urls.push(site + $(".allmode-items > li > a")[i].attribs.href);
        }
        // console.log(urls);

        return urls;
      }, console.error)
      .then((urls) => {
        Promise.all(urls.map((url) => axios.get(url))).then((responses) => {
          resolve(
            responses.map((response) => {
              const $ = cheerio.load(response.data);
              const image = $("[itemprop=articleBody] > p > a").attr("href")
                ? site + $("[itemprop=articleBody] > p > a").attr("href")
                : "https://github.com/DigitalM0nkey/BoozeCruise/blob/master/images/BoozeCruiseNews.jpg?raw=true";
              // console.log($);
              //console.log(image);

              return {
                date: $("time").attr("datetime")
                  ? moment($("time").attr("datetime")).fromNow()
                  : moment().startOf("day").fromNow(),
                source: `cruiseindustrynews.com`,
                title: $("h1").text().trim(),
                image: image,
                body: $("[itemprop=articleBody]").text().trim(),
              };
            })
          );
          console.log("End Cruise Industry News Scraper");
        }, console.error);
      }, console.error)
      .catch((err) => {
        console.log("SCRAPER ERROR =>", err);
        reject(err);
      });
  });

module.exports = async () => {
  try {
    if (articles.length === 0) {
      articles = await getCruiseIndustryNews(site);
    }
    return articles;
  } catch (err) {
    // catches errors both in fetch and response.json
    console.error(err);
  }
};

//console.log(getCruiseIndustryNews("https://www.cruiseindustrynews.com/"));
