//https://www.cruisehive.com/category/cruise-news

const cheerio = require("cheerio");
const axios = require("axios");
const moment = require("moment");
let articles = [];
const site = "https://www.cruisehive.com";

console.log("Start Cruise Hive Scraper");

const getCruiseIndustryNews = (url) =>
  new Promise(function (resolve, reject) {
    axios
      .get(`${url}/category/cruise-news`)
      .then((response) => {
        //console.log(response);

        const $ = cheerio.load(response.data);
        // console.log($(".td-module-thumb > a").attr("href"));

        let urls = [];
        for (let i = 0; i < $(".td-module-thumb > a").length; i++) {
          urls.push($(".td-module-thumb > a")[i].attribs.href);
        }
        // console.log(urls);

        return urls;
      })
      .then((urls) => {
        Promise.all(urls.map((url) => axios.get(url))).then((responses) => {
          resolve(
            responses.map((response) => {
              const $ = cheerio.load(response.data);
              // const image = $(".tdb_single_bg_featured_image > style > style");
              const image =
                "https://github.com/DigitalM0nkey/BoozeCruise/blob/master/images/BoozeCruiseNews.jpg?raw=true";
              // const image = $(".entry-thumb").attr("src")
              //   ? $(".tdb_single_bg_featured_image > style > style").attr(".tdb-featured-image-bg")
              //   : "https://github.com/DigitalM0nkey/BoozeCruise/blob/master/images/BoozeCruiseNews.jpg?raw=true";
              console.log("IMGAR => ", $(".tdb-block-inner  > time").attr("datetime"));

              return {
                date: $(".tdb-block-inner  > time").attr("datetime")
                  ? moment($(".tdb-block-inner  > time").attr("datetime")).fromNow()
                  : moment().startOf("day").fromNow(),
                source: `cruisehive.com`,
                title: $(".tdb-title-text").text(),
                image: image,
                body: $(".td_block_wrap > .tdb-block-inner > p").text(),
              };
            })
          );
          console.log("End Cruise Hive Scraper");
        });
      })
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

// console.log(getCruiseIndustryNews("https://www.cruisehive.com/"));
