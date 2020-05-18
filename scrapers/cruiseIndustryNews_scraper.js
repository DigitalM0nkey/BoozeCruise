const cheerio = require("cheerio");
const axios = require("axios");
let articles = [];
const site = "https://www.cruiseindustrynews.com";

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
      })
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
                date: $("time").text().trim(),
                source: `cruiseindustrynews.com`,
                title: $("h1").text().trim(),
                image: image,
                body: $("[itemprop=articleBody]").text().trim(),
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
